'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import "../../styles/notes/notes.scss";

interface Note {
  _id: string;
  id: number;
  author: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

const NotesPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);

  // Загрузка заметок
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Создание заметки
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !newAuthor.trim()) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          author: newAuthor,
          text: newNote 
        }),
      });

      if (res.ok) {
        setNewNote('');
        setNewAuthor('');
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  // Обновление заметки
const handleUpdateNote = async (id: string) => {  // ← id приходит из пропсов
  if (!editText.trim()) return;

  try {
    const res = await fetch(`/api/notes/${id}`, {  // ← используется переданный id
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText }),
    });

    if (res.ok) {
      setEditingId(null);
      setEditText('');
      fetchNotes();
    }
  } catch (error) {
    console.error('Failed to update note:', error);
  }
};

// Удаление заметки
const handleDeleteNote = async (id: string) => {  // ← id приходит из пропсов
  if (!confirm('Удалить заметку?')) return;

  try {
    const res = await fetch(`/api/notes/${id}`, {  // ← используется переданный id
      method: 'DELETE',
    });

    if (res.ok) {
      fetchNotes();
    }
  } catch (error) {
    console.error('Failed to delete note:', error);
  }
};
  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notes-page">
      <motion.div 
        className="notes-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Заметки</h1>
        <p>Командные заметки и идеи</p>
      </motion.div>

      {/* Форма создания заметки */}
      <motion.form 
        className="create-note-form"
        onSubmit={handleCreateNote}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="form-row">
          <input
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="Ваше имя"
            className="author-input"
          />
        </div>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Текст заметки..."
          rows={3}
        />
        <button 
          type="submit" 
          disabled={!newNote.trim() || !newAuthor.trim()}
        >
          Добавить заметку
        </button>
      </motion.form>

      {/* Список заметок */}
      <div className="notes-grid">
        {loading ? (
          <div className="loading">Загрузка заметок...</div>
        ) : notes.length === 0 ? (
          <div className="no-notes">Пока нет заметок</div>
        ) : (
          <AnimatePresence>
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                className="note-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                {editingId === note.id ? (
                  // Режим редактирования
                  <div className="note-edit">
                    <div className="note-author-display">
                      <span className="author-label">Автор:</span>
                      <span className="author-name">{note.author}</span>
                    </div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button onClick={() => handleUpdateNote(note.id)}>
                        Сохранить
                      </button>
                      <button onClick={() => setEditingId(null)}>
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  // Режим просмотра
                  <>
                    <div className="note-header">
                      <span className="note-author">{note.author}</span>
                      <span className="note-date">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="note-text">{note.text}</p>
                    {note.updatedAt !== note.createdAt && (
                      <div className="note-edited">
                        (ред. {formatDate(note.updatedAt)})
                      </div>
                    )}
                    <div className="note-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => {
                          setEditingId(note.id); 
                          setEditText(note.text);
                        }}
                      >
                        ✎
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        ×
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default NotesPage;