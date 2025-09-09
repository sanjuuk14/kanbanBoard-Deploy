// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import * as api from "../api/tasks";

// // Thunks
// export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
//   const { data } = await api.getTasks();
//   return data;
// });

// export const addNewTask = createAsyncThunk("tasks/addNewTask", async (task) => {
//   const { data } = await api.addTask(task);
//   return { ...data, tempId: task.tempId };
// });

// export const deleteTaskById = createAsyncThunk(
//   "tasks/deleteTaskById",
//   async (id) => {
//     await api.deleteTask(id);
//     return id;
//   }
// );

// export const editTask = createAsyncThunk(
//   "tasks/editTask",
//   async ({ id, task }) => {
//     const { data } = await api.updateTask(id, task);
//     return data;
//   }
// );

// export const updateTaskStatus = createAsyncThunk(
//   "tasks/updateTaskStatus",
//   async ({ id, status }) => {
//     const { data } = await api.updateTaskStatus(id, status);
//     return data;
//   }
// );

// const tasksSlice = createSlice({
//   name: "tasks",
//   initialState: { tasks: [], loading: false, error: null },
//   reducers: {
//     moveTask: (state, action) => {
//       const { id, status } = action.payload;
//       const task = state.tasks.find((t) => t._id === id);
//       if (task) task.status = status;
//     },
//     addTaskOptimistic: (state, action) => {
//       // prevent duplicate optimistic tasks
//       const exists = state.tasks.find(
//         (t) => t.tempId === action.payload.tempId
//       );
//       if (!exists) {
//         state.tasks.push(action.payload);
//       }
//     },
//     deleteTaskOptimistic: (state, action) => {
//       state.tasks = state.tasks.filter((t) => t._id !== action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTasks.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchTasks.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tasks = action.payload;
//       })
//       .addCase(fetchTasks.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(addNewTask.fulfilled, (state, action) => {
//         // Replace optimistic task with real one
//         const idx = state.tasks.findIndex(
//           (t) => t.tempId === action.payload.tempId
//         );
//         if (idx !== -1) {
//           state.tasks[idx] = action.payload;
//         } else {
//           state.tasks.push(action.payload);
//         }
//       })
//       .addCase(deleteTaskById.fulfilled, (state, action) => {
//         state.tasks = state.tasks.filter((t) => t._id !== action.payload);
//       })
//       .addCase(editTask.fulfilled, (state, action) => {
//         const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
//         if (idx !== -1) state.tasks[idx] = action.payload;
//       })
//       .addCase(updateTaskStatus.fulfilled, (state, action) => {
//         const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
//         if (idx !== -1) state.tasks[idx] = action.payload;
//       });
//   },
// });

// export const { moveTask, addTaskOptimistic, deleteTaskOptimistic } =
//   tasksSlice.actions;
// export default tasksSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api/tasks";

// 🔹 Thunks
export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const { data } = await api.getTasks();
  return Array.isArray(data) ? data : []; // ensure array
});

export const addNewTask = createAsyncThunk("tasks/addNewTask", async (task) => {
  const { data } = await api.addTask(task);
  return { ...data, tempId: task.tempId }; // keep tempId for replacement
});

export const deleteTaskById = createAsyncThunk(
  "tasks/deleteTaskById",
  async (id) => {
    await api.deleteTask(id);
    return id;
  }
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, task }) => {
    const { data } = await api.updateTask(id, task);
    return data;
  }
);

export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }) => {
    const { data } = await api.updateTask(id, { status });
    return data;
  }
);

// 🔹 Slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [], loading: false, error: null },
  reducers: {
    moveTask: (state, action) => {
      if (!Array.isArray(state.tasks)) state.tasks = [];
      const { id, status } = action.payload;
      const task = state.tasks.find((t) => t._id === id);
      if (task) task.status = status;
    },
    addTaskOptimistic: (state, action) => {
      if (!Array.isArray(state.tasks)) state.tasks = [];
      state.tasks.push(action.payload);
    },
    deleteTaskOptimistic: (state, action) => {
      if (!Array.isArray(state.tasks)) state.tasks = [];
      state.tasks = state.tasks.filter((t) => t._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        if (!Array.isArray(state.tasks)) state.tasks = [];
        const idx = state.tasks.findIndex(
          (t) => t.tempId === action.payload.tempId
        );
        if (idx !== -1) {
          state.tasks[idx] = action.payload; // replace optimistic
        } else {
          state.tasks.push(action.payload);
        }
      })
      .addCase(deleteTaskById.fulfilled, (state, action) => {
        if (!Array.isArray(state.tasks)) state.tasks = [];
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        if (!Array.isArray(state.tasks)) state.tasks = [];
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        if (!Array.isArray(state.tasks)) state.tasks = [];
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      });
  },
});

export const { moveTask, addTaskOptimistic, deleteTaskOptimistic } =
  tasksSlice.actions;
export default tasksSlice.reducer;
