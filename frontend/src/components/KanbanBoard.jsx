import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, GripVertical, AlertCircle, Clock, CheckCircle2, Trash2 } from 'lucide-react';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'view' 
  const [modalTask, setModalTask] = useState(null); // The task currently being edited/viewed
  const [newTaskStatus, setNewTaskStatus] = useState('To Do');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Socket connection
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.emit('joinProject', projectId);

    socket.on('taskCreated', (task) => setTasks((prev) => [...prev, task]));
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    });
    socket.on('taskDeleted', (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });
    socket.on('tasksReordered', (reorderedTasks) => {
      setTasks((prev) => {
        let newTasks = [...prev];
        reorderedTasks.forEach((update) => {
          const idx = newTasks.findIndex(t => t._id === update._id);
          if (idx !== -1) {
            newTasks[idx] = { ...newTasks[idx], status: update.status, order: update.order };
          }
        });
        return newTasks.sort((a, b) => a.order - b.order);
      });
    });

    return () => {
      socket.emit('leaveProject', projectId);
      socket.disconnect();
    };
  }, [projectId]);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/projects/${projectId}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [projectId, token]);

  const columnsWithTasks = useMemo(() => {
    const acc = { 'To Do': [], 'In Progress': [], 'Done': [] };
    tasks.forEach(t => {
      if (acc[t.status]) acc[t.status].push(t);
    });
    Object.keys(acc).forEach(key => {
      acc[key].sort((a, b) => a.order - b.order);
    });
    return acc;
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(tasks.find((t) => t._id === active.id));
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const overIndex = tasks.findIndex((t) => t._id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].status = overId;
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find(t => t._id === active.id);
    if (!movedTask) return;

    const columnTasks = updatedTasks.filter(t => t.status === movedTask.status);

    const batchUpdates = columnTasks.map((t, idx) => ({
      _id: t._id,
      status: t.status,
      order: (idx + 1) * 1000
    }));

    setTasks(prev => {
      const cloned = [...prev];
      batchUpdates.forEach(bu => {
        const ix = cloned.findIndex(c => c._id === bu._id);
        if (ix !== -1) cloned[ix].order = bu.order;
      });
      return cloned.sort((a, b) => a.order - b.order);
    });

    try {
      await axios.put(
        `http://localhost:3000/api/projects/${projectId}/tasks/reorder`,
        { updates: batchUpdates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to reorder tasks API', err);
    }
  };

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      priority: formData.get('priority'),
      status: formData.get('status') || newTaskStatus,
      subTasks: modalTask ? modalTask.subTasks : [],
      comments: modalTask ? modalTask.comments : [],
    };

    try {
      if (modalMode === 'create') {
        axios.post(`http://localhost:3000/api/projects/${projectId}/tasks`, data, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(() => setIsModalOpen(false)).catch(console.error);
      } else if (modalMode === 'edit' && modalTask) {
        // Editing existing task
        axios.put(`http://localhost:3000/api/projects/${projectId}/tasks/${modalTask._id}`, data, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(() => setIsModalOpen(false)).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/api/projects/${projectId}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const openEditModal = (task) => {
    // Deep copy to prevent local mutations leaking without save
    const clonedTask = JSON.parse(JSON.stringify(task));
    clonedTask.subTasks = clonedTask.subTasks || [];
    clonedTask.comments = clonedTask.comments || [];
    setModalTask(clonedTask);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const openCreateModal = (status) => {
    setModalTask({
      _id: 'temp-' + Date.now(),
      title: '',
      description: '',
      status: status,
      priority: 'medium',
      subTasks: [],
      comments: []
    });
    setNewTaskStatus(status);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const instantSaveTask = async (updatedTaskObj) => {
    if (modalMode !== 'edit') return;
    try {
      // Grab current form fields to ensure we don't overwrite with old state 
      const form = document.getElementById('task-form');
      if (form) {
        updatedTaskObj.title = form.querySelector('[name="title"]').value;
        updatedTaskObj.description = form.querySelector('[name="description"]').value;
        updatedTaskObj.priority = form.querySelector('[name="priority"]').value;
        updatedTaskObj.status = form.querySelector('[name="status"]').value;
      }

      await axios.put(`http://localhost:3000/api/projects/${projectId}/tasks/${updatedTaskObj._id}`, updatedTaskObj, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Instant save failed", err);
    }
  };

  const handleToggleSubTask = (index) => {
    if (!modalTask) return;
    const newTasks = [...modalTask.subTasks];
    newTasks[index].isCompleted = !newTasks[index].isCompleted;
    const updated = { ...modalTask, subTasks: newTasks };
    setModalTask(updated);
    instantSaveTask(updated);
  };

  const handleUpdateSubTaskTitle = (index, newTitle) => {
    if (!modalTask) return;
    const newTasks = [...modalTask.subTasks];
    newTasks[index].title = newTitle;
    setModalTask({ ...modalTask, subTasks: newTasks });
    // Intentionally not instant saving every keystroke to prevent API spam, it will save when 'Save' or other instant action fires.
  };

  const handleAddSubTask = () => {
    if (!modalTask) return;
    const newTasks = [...(modalTask.subTasks || []), { title: '', isCompleted: false }];
    const updated = { ...modalTask, subTasks: newTasks };
    setModalTask(updated);
    if (modalMode === 'edit') instantSaveTask(updated);
  };

  const handleDeleteSubTask = (index) => {
    if (!modalTask || !modalTask.subTasks) return;
    const newTasks = modalTask.subTasks.filter((_, i) => i !== index);
    const updated = { ...modalTask, subTasks: newTasks };
    setModalTask(updated);
    if (modalMode === 'edit') instantSaveTask(updated);
  };

  const handleAddComment = () => {
    if (!modalTask) return;
    const input = document.getElementById('comment-input');
    if (!input.value.trim()) return;
    const newComments = [...(modalTask.comments || []), { text: input.value, user: 'You', createdAt: new Date() }];
    const updated = { ...modalTask, comments: newComments };
    setModalTask(updated);
    if (modalMode === 'edit') instantSaveTask(updated);
    input.value = '';
  };

  return (
    <div className="flex-1 flex flex-col pt-8 bg-[#0f0a1f]/50">

      {/* Top Bar inside Kanban */}
      <div className="flex justify-between items-center px-8 mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Board Map</h2>
        <div className="flex gap-3">
          <button onClick={() => openCreateModal('To Do')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto px-8 pb-8 flex-1 h-full min-h-[600px] custom-scrollbar">
          {COLUMNS.map((colStr) => (
            <Column
              key={colStr}
              column={colStr}
              tasks={columnsWithTasks[colStr]}
              onAdd={() => openCreateModal(colStr)}
              onTaskClick={openEditModal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Unified Create/View/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-10 overflow-y-auto">
          <div className="bg-[#1a1625] border border-purple-900/30 rounded-2xl w-full max-w-5xl shadow-[0_0_80px_rgba(0,0,0,1)] text-gray-200 overflow-hidden flex flex-col md:flex-row my-auto">

            {/* LEFT COLUMN */}
            <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-purple-900/30">
              <form id="task-form" onSubmit={handleCreateOrUpdateTask} className="flex flex-col h-full">

                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-widest bg-purple-500/10 px-2 flex items-center h-6 rounded">Development</span>
                  <span className="text-xs text-gray-400 font-mono tracking-widest">• PRJ-{(modalTask?._id || '2402').toString().slice(-4).toUpperCase()}</span>
                </div>

                <input
                  name="title"
                  defaultValue={modalMode === 'edit' && modalTask ? modalTask.title : ''}
                  required
                  placeholder="Task Title..."
                  className="w-full bg-transparent text-3xl md:text-4xl font-bold text-white outline-none placeholder-gray-600 mb-8"
                />

                <div className="flex items-center gap-4 mb-10">
                  <select name="status" defaultValue={modalMode === 'edit' && modalTask ? modalTask.status : newTaskStatus} className="bg-purple-900/20 text-purple-400 border border-purple-900/50 rounded-lg px-4 py-2 appearance-none outline-none font-semibold text-sm cursor-pointer hover:bg-purple-900/40 transition">
                    <option value="To Do">⏳ To Do</option>
                    <option value="In Progress">⌛ In Progress</option>
                    <option value="Done">✅ Done</option>
                  </select>

                  <select name="priority" defaultValue={modalMode === 'edit' && modalTask ? modalTask.priority : 'medium'} className="bg-red-900/10 text-red-400 border border-red-900/50 rounded-lg px-4 py-2 appearance-none outline-none font-semibold text-sm cursor-pointer hover:bg-red-900/30 transition">
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">❗ High Priority</option>
                  </select>
                </div>

                <div className="mb-2">
                  <h4 className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-4">Description</h4>
                  <textarea
                    name="description"
                    defaultValue={modalMode === 'edit' && modalTask ? modalTask.description : ''}
                    placeholder="Add detailed description here..."
                    className="w-full bg-transparent text-base text-gray-300 outline-none placeholder-gray-600 resize-none leading-relaxed"
                    rows="4"
                  ></textarea>
                </div>

                {/* Sub-tasks Dynamic Block */}
                <div className="mt-6 flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase">Sub-Tasks Checklist</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded">
                        {modalTask?.subTasks?.filter(s => s.isCompleted)?.length || 0}/{modalTask?.subTasks?.length || 0} Complete
                      </span>
                      <button type="button" onClick={handleAddSubTask} className="text-[10px] bg-purple-600/20 text-purple-400 hover:bg-purple-600 hover:text-white px-2 py-1 rounded transition tracking-widest uppercase font-bold text-center">+ Add Item</button>
                    </div>
                  </div>

                  <div className="space-y-3 font-medium">
                    {(modalTask ? modalTask.subTasks : []).map((sub, index) => (
                      <div key={index} className="flex items-center gap-4 bg-[#130f1e]/80 p-3 rounded-xl border border-transparent">
                        <div
                          onClick={() => handleToggleSubTask(index)}
                          className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition ${sub.isCompleted ? 'bg-[#8b31ff] text-white' : 'border border-gray-600'}`}
                        >
                          {sub.isCompleted && '✓'}
                        </div>
                          <input 
                            type="text" 
                            value={sub.title} 
                            onChange={(e) => handleUpdateSubTaskTitle(index, e.target.value)}
                            onBlur={() => { if (modalMode === 'edit') instantSaveTask(modalTask); }}
                            placeholder="Type subtask here..."
                            className={`flex-1 bg-transparent border-none outline-none ${sub.isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`} 
                          />
                          <button type="button" onClick={() => handleDeleteSubTask(index)} className="text-gray-600 hover:text-red-500 transition px-1">
                             <Trash2 size={13} />
                          </button>
                       </div>
                    ))}
                    {(!modalTask?.subTasks || modalTask?.subTasks?.length === 0) && (
                      <p className="text-sm text-gray-500 italic">No sub-tasks added yet.</p>
                    )}
                  </div>
                </div>

              </form>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full md:w-[380px] bg-[#161220] p-8 md:p-10 flex flex-col justify-between">

              <div>
                <div className="mb-10">
                  <h4 className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-4">Assignee</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl relative shadow-inner flex items-center justify-center text-gray-400 font-bold text-lg">
                      <span className="w-6 h-6 border-2 border-gray-300 rounded opacity-50 absolute"></span>
                      A
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00d885] rounded-full border-2 border-[#161220]"></div>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Alex Smith</p>
                      <p className="text-xs text-gray-500 mt-0.5">Backend Developer</p>
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase mb-4">Due Date</h4>
                  <div className="flex items-center gap-3 text-white font-semibold text-sm">
                    <Clock className="text-purple-500" size={18} />
                    Dec 22, 2024
                  </div>
                </div>

                <div className="mb-10 lg:mb-0">
                  <div className="flex items-center justify-between mb-5">
                    <h4 className="text-[11px] font-bold text-gray-500 tracking-[0.15em] uppercase">Activity Feed</h4>
                    <span className="text-gray-500 tracking-widest leading-none cursor-pointer">...</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2 mb-4">
                       <input id="comment-input" type="text" placeholder="Add a comment..." className="flex-1 bg-[#1a1625] border border-purple-900/30 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-purple-500 transition placeholder-gray-600" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }} />
                       <button type="button" onClick={handleAddComment} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-bold transition tracking-wider uppercase">Post</button>
                    </div>

                    <div className="h-[180px] overflow-y-auto custom-scrollbar pr-2 pb-2">
                      {modalTask?.comments?.length > 0 ? (
                        <div className="space-y-4">
                          {[...modalTask.comments].slice(-5).reverse().map((comment, idx) => (
                            <div key={idx} className="relative flex items-start gap-3">
                              <div className="w-[28px] h-[28px] shrink-0 rounded-full bg-purple-900/40 text-purple-400 text-[10px] font-bold flex items-center justify-center shadow-sm mt-0.5 select-none transition-transform hover:scale-110">
                                {comment.user.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs leading-tight mb-1">
                                  <span className="text-gray-300 font-bold">{comment.user}</span>
                                  <span className="text-gray-500"> commented</span>
                                  <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest ml-2 hidden sm:inline-block">
                                    {new Date(comment.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                  </span>
                                </p>
                                <p className="text-[11px] text-gray-400 leading-relaxed italic">
                                  "{comment.text}"
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 italic pb-2">No comments to display.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-10 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <button type="submit" form="task-form" className="flex-1 bg-[#221c35] hover:bg-[#2c2445] text-white font-bold py-4 rounded-xl transition tracking-wider uppercase text-xs border border-transparent hover:border-purple-900/30">
                    Save
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-transparent hover:bg-white/5 text-gray-500 hover:text-gray-300 font-bold py-4 rounded-xl transition tracking-wider uppercase text-xs">
                    Cancel
                  </button>
                </div>
                {modalMode === 'edit' && (
                  <button type="button" onClick={() => handleDeleteTask(modalTask._id)} className="w-full mt-2 text-red-500/70 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition underline">
                    Delete Task
                  </button>
                )}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function Column({ column, tasks, onAdd, onTaskClick }) {
  const { setNodeRef } = useSortable({ id: column, data: { type: 'Column', column } });

  const getIcon = () => {
    if (column === 'To Do') return <AlertCircle size={18} className="text-gray-400" />;
    if (column === 'In Progress') return <Clock size={18} className="text-blue-400" />;
    return <CheckCircle2 size={18} className="text-green-400" />;
  };

  const getBadgeColor = () => {
    if (column === 'To Do') return 'bg-gray-700/50 text-gray-300 text-xs px-2 py-0.5 rounded-full';
    if (column === 'In Progress') return 'bg-blue-900/30 text-blue-400 text-xs px-2 py-0.5 rounded-full';
    return 'bg-green-900/30 text-green-400 text-xs px-2 py-0.5 rounded-full';
  };

  return (
    <div className="flex flex-col flex-1 min-w-[300px]">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold text-gray-200">{column}</h3>
          <span className={getBadgeColor()}>{tasks.length}</span>
        </div>
        <button onClick={onAdd} className="text-gray-400 hover:text-white p-1 hover:bg-purple-600/20 rounded transition">
          <Plus size={16} />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 p-3 flex flex-col gap-3 min-h-[150px] overflow-y-auto custom-scrollbar">
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTask key={task._id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-purple-900/20 rounded-lg text-gray-500 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTask({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
    data: { type: 'Task', task },
  });

  const style = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging) {
    return (
      <div ref={setNodeRef} style={style} className="opacity-40 h-[90px] border-2 border-purple-500 border-dashed rounded-xl bg-purple-900/20" />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}

function TaskCard({ task, isOverlay, onClick }) {
  const priorityColors = {
    low: 'bg-green-500/10 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    high: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div
      onClick={(e) => {
        // Prevent click if they were just dragging
        if (e.defaultPrevented) return;
        if (onClick) onClick();
      }}
      className={`bg-[#1c1438] border border-purple-900/50 p-4 rounded-xl shadow-lg cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-colors group ${isOverlay ? 'shadow-[0_0_30px_rgba(168,85,247,0.3)] rotate-2 scale-105' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityColors[task.priority] || priorityColors.medium}`}>
          {task.priority || 'medium'}
        </span>
        <GripVertical size={14} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h4 className="font-semibold text-gray-100 mb-1 leading-tight">{task.title}</h4>

      {/* Description removed from here directly as requested */}

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-purple-900/30">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-[#1c1438]" title="Assignee"></div>
        </div>
        <span className="text-[10px] text-gray-500 flex items-center gap-1">
          <Clock size={10} />
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
