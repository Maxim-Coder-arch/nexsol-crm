'use client';

import { useState, useEffect } from 'react';
import "../../styles/notes/notes.scss";

interface Note {
  _id: string;
  author: string;
  text: string;
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newAuthor, setNewAuthor] = useState('');
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: newAuthor, text: newText }),
      });

      if (res.ok) {
        const data = await res.json();
        setNotes(prevNotes => [data.note, ...prevNotes]);
        setNewAuthor('');
        setNewText('');
        setError('');
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при добавлении');
      }
    } catch (err) {
      setError('Ошибка при добавлении');
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Удалить заметку?')) return;

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
      } else {
        const data = await res.json();
        setError(data.error || 'Ошибка при удалении');
      }
    } catch (err) {
      setError('Ошибка при удалении');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notes-page">
      <h1>Заметки</h1>

      <form onSubmit={addNote} className="add-form-notes">
        <input
          type="text"
          placeholder="Ваше имя"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
        />
        <textarea
          placeholder="Текст заметки"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          rows={3}
        />
        <button type="submit">Добавить</button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="notes-list">
        {loading ? (
          <p>Загрузка...</p>
        ) : notes.length === 0 ? (
          <p>Пока нет заметок</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <div className="note-header">
                <span className="author">{note.author}</span>
                <span className="date">{formatDate(note.createdAt)}</span>
              </div>
              <p className="note-text">{note.text}</p>
              <button 
                className="delete-btn"
                onClick={() => deleteNote(note._id)}
              >
                Удалить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}