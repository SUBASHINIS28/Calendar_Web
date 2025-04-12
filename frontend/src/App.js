import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from './redux/store';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import TaskDragLayer from './components/TaskDragLayer';
import EventDragLayer from './components/EventDragLayer';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Calendar />
            </main>
          </div>
          <TaskDragLayer />
          <EventDragLayer />
        </div>
      </DndProvider>
    </Provider>
  );
}

export default App;
