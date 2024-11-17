import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Edit2, Trash2, CheckCircle, ListTodo } from 'lucide-react';
import { useMarketingStore } from '../store/marketingStore';
import ContentForm from './ContentForm';

const MarketingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { contents, getContentsByDate, addContent, updateContent, deleteContent } = useMarketingStore();
  const [newNote, setNewNote] = useState('');
  const [noteColor, setNoteColor] = useState('#FEF3C7');

  // Get today's and tomorrow's dates
  const today = formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const tomorrow = formatDate(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 1
  );

  const todayContents = getContentsByDate(today)?.contents || [];
  const tomorrowContents = getContentsByDate(tomorrow)?.contents || [];

  // Calculate task statistics
  const totalTasks = contents.reduce((sum, day) => sum + day.contents.length, 0);
  const completedTasks = contents.reduce((sum, day) => 
    sum + day.contents.filter(content => content.status === 'completed').length, 0
  );
  const pendingTasks = totalTasks - completedTasks;

  const colorOptions = [
    { value: '#FEF3C7', label: 'Yellow' },
    { value: '#DBEAFE', label: 'Blue' },
    { value: '#DCF9E6', label: 'Green' },
    { value: '#FEE2E2', label: 'Red' },
    { value: '#E5E7EB', label: 'Gray' }
  ];

  function formatDate(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.setMonth(
      currentDate.getMonth() + (direction === 'next' ? 1 : -1)
    )));
  };

  const addNote = () => {
    if (newNote.trim()) {
      addContent(today, {
        title: 'Note',
        description: newNote,
        platform: 'website',
        time: new Date().toLocaleTimeString(),
        backgroundColor: noteColor
      });
      setNewNote('');
    }
  };

  const renderContentTable = (date: string, contents: any[]) => {
    const completedTasks = contents.filter(c => c.status === 'completed').length;
    const totalTasks = contents.length;

    return (
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {date === today ? "Today's" : "Tomorrow's"} Content
          </h3>
          <div className="text-sm text-gray-600">
            {completedTasks}/{totalTasks} Tasks
          </div>
        </div>
        <div className="space-y-3">
          {contents.map((content) => (
            <div
              key={content.id}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: content.backgroundColor || '#F3F4F6' }}
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={content.status === 'completed'}
                    onChange={() => updateContent(
                      date,
                      content.id,
                      content.status === 'completed' ? 'pending' : 'completed'
                    )}
                    className="mr-3"
                  />
                  <div className="min-w-0"> {/* Prevent text overflow */}
                    <h4 className="font-medium truncate">{content.title}</h4>
                    <p className="text-sm text-gray-600 truncate">{content.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                      {content.time}
                      <span className="mx-2">•</span>
                      <span className="capitalize">{content.platform}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteContent(date, content.id)}
                className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Marketing Calendar</h1>
        <p className="text-gray-600">Plan and manage your content schedule</p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>
            <ListTodo className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Daily Content Tables */}
      <div className="space-y-6">
        {renderContentTable(today, todayContents)}
        {renderContentTable(tomorrow, tomorrowContents)}
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => {
              setSelectedDate(formatDate(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
              ));
              setShowForm(true);
            }}
            className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px mb-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center py-2 bg-gray-50 font-medium text-gray-500 text-xs md:text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {Array(getFirstDayOfMonth(currentDate)).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 md:h-24 bg-gray-50" />
          ))}
          {Array(getDaysInMonth(currentDate)).fill(null).map((_, i) => {
            const date = formatDate(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
            const dayContents = getContentsByDate(date);
            const isToday = date === today;

            return (
              <div
                key={i}
                className={`h-16 md:h-24 border border-gray-200 p-1 md:p-2 cursor-pointer hover:bg-gray-50 ${
                  isToday ? 'bg-blue-50' : 'bg-white'
                }`}
                onClick={() => {
                  setSelectedDate(date);
                  setShowForm(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xs md:text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                    {i + 1}
                  </span>
                  {dayContents && (
                    <span className="text-xs px-1 md:px-2 py-0.5 md:py-1 rounded-full bg-green-100 text-green-800">
                      {dayContents.contents.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-0.5 md:space-y-1 hidden md:block">
                  {dayContents?.contents.slice(0, 2).map((content) => (
                    <div
                      key={content.id}
                      className={`text-xs truncate ${
                        content.status === 'completed' ? 'text-green-600' : 'text-gray-600'
                      }`}
                      style={{ backgroundColor: content.backgroundColor }}
                    >
                      • {content.title}
                    </div>
                  ))}
                  {dayContents?.contents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayContents.contents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && selectedDate && (
        <ContentForm
          date={selectedDate}
          onClose={() => {
            setShowForm(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
};

export default MarketingCalendar;