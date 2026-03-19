"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/director/tools.scss";
import TemplateBack from "@/app/components/template/template";
import { Tool } from "@/types/directorTool.type";

export default function DirectorToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<string>("dev");
  const [newIcon, setNewIcon] = useState("🔧");

  const categories = [
    { id: "design", name: "Дизайн", icon: "🎨" },
    { id: "dev", name: "Разработка", icon: "💻" },
    { id: "marketing", name: "Маркетинг", icon: "📢" },
    { id: "analytics", name: "Аналитика", icon: "📊" },
    { id: "other", name: "Другое", icon: "🔧" },
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const res = await fetch("/api/director/tools");
      const data = await res.json();
      setTools(data);
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const addTool = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName || !newDescription || !newUrl || !newCategory) {
      setError("Заполните все поля");
      return;
    }

    try {
      const res = await fetch("/api/director/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          url: newUrl,
          category: newCategory,
          icon: newIcon,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTools((prev) => [data.tool, ...prev]);
        setNewName("");
        setNewDescription("");
        setNewUrl("");
        setNewCategory("dev");
        setNewIcon("🔧");
        setShowForm(false);
      }
    } catch {
      setError("Ошибка при добавлении");
    }
  };

  const deleteTool = async (id: string) => {
    if (!confirm("Удалить инструмент?")) return;

    try {
      const res = await fetch(`/api/director/tools/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTools((prev) => prev.filter((t) => t._id !== id));
      }
    } catch {
      setError("Ошибка при удалении");
    }
  };

  const getCategoryName = (cat: string) => {
    const category = categories.find((c) => c.id === cat);
    return category ? category.name : cat;
  };

  const getCategoryIcon = (cat: string) => {
    const category = categories.find((c) => c.id === cat);
    return category ? category.icon : "🔧";
  };

  return (
    <>
      <TemplateBack />
      <div className="director-tools">
        <div className="director-tools__header">
          <h1>Управление инструментами</h1>
          <p>Добавляйте полезные сервисы для команды</p>
        </div>

        <div className="director-tools__action">
          <button
            className="director-tools__add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "−" : "+"} Новый инструмент
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form
              className="director-tools__form"
              onSubmit={addTool}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h2>Новый инструмент</h2>

              <div className="director-tools__field">
                <label>Название</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Например: Canva"
                  required
                />
              </div>

              <div className="director-tools__field">
                <label>Описание</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Для чего нужен"
                  required
                />
              </div>

              <div className="director-tools__field">
                <label>Ссылка</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="director-tools__field">
                <label>Категория</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="director-tools__field">
                <label>Иконка (эмодзи)</label>
                <input
                  type="text"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  placeholder="🔧"
                  maxLength={2}
                />
              </div>

              <button type="submit" className="director-tools__submit">
                Добавить
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="director-tools__list">
          {loading ? (
            <div className="director-tools__loading">Загрузка...</div>
          ) : tools.length === 0 ? (
            <div className="director-tools__empty">Нет инструментов</div>
          ) : (
            tools.map((tool) => (
              <motion.div
                key={tool._id}
                className="director-tools__card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="director-tools__card-icon">{tool.icon}</div>
                <div className="director-tools__card-content">
                  <div className="director-tools__card-header">
                    <h3>{tool.name}</h3>
                    <button
                      className="director-tools__card-delete"
                      onClick={() => deleteTool(tool._id)}
                    >
                      ×
                    </button>
                  </div>
                  <p>{tool.description}</p>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    {tool.url}
                  </a>
                  <div className="director-tools__card-meta">
                    <span className="director-tools__card-category">
                      {getCategoryIcon(tool.category)}{" "}
                      {getCategoryName(tool.category)}
                    </span>
                    <span className="director-tools__card-author">
                      Добавил: {tool.createdBy}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {error && <div className="director-tools__error">{error}</div>}
      </div>
    </>
  );
}
