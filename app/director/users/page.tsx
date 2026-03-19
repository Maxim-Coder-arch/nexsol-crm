"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/director/users.scss";
import { User } from "@/types/directorUser.type";

export default function DirectorUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "director" | "manager">(
    "manager",
  );
  const [newSpecialties, setNewSpecialties] = useState<string[]>([]);
  const [newSpecialtyInput, setNewSpecialtyInput] = useState("");
  const [newResponsibilities, setNewResponsibilities] = useState<string[]>([]);
  const [newResponsibilityInput, setNewResponsibilityInput] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "director" | "manager">(
    "manager",
  );
  const [editSpecialties, setEditSpecialties] = useState<string[]>([]);
  const [editSpecialtyInput, setEditSpecialtyInput] = useState("");
  const [editResponsibilities, setEditResponsibilities] = useState<string[]>(
    [],
  );
  const [editResponsibilityInput, setEditResponsibilityInput] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/director/users");
      const data = await res.json();
      setUsers(data);
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialtyInput.trim()) {
      setNewSpecialties([...newSpecialties, newSpecialtyInput.trim()]);
      setNewSpecialtyInput("");
    }
  };

  const removeSpecialty = (index: number) => {
    setNewSpecialties(newSpecialties.filter((_, i) => i !== index));
  };

  const addResponsibility = () => {
    if (newResponsibilityInput.trim()) {
      setNewResponsibilities([
        ...newResponsibilities,
        newResponsibilityInput.trim(),
      ]);
      setNewResponsibilityInput("");
    }
  };

  const removeResponsibility = (index: number) => {
    setNewResponsibilities(newResponsibilities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName || !newEmail || !newPassword || !newRole) {
      setError("Заполните обязательные поля");
      return;
    }

    try {
      const res = await fetch("/api/director/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
          specialties: newSpecialties,
          responsibilities: newResponsibilities,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => [data.user, ...prev]);
        resetForm();
        setShowForm(false);
        setError("");
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка при создании");
      }
    } catch {
      setError("Ошибка при создании");
    }
  };

  const resetForm = () => {
    setNewName("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("manager");
    setNewSpecialties([]);
    setNewResponsibilities([]);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditSpecialties([...user.specialties]);
    setEditResponsibilities([...user.responsibilities]);
    setEditPassword("");
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditPassword("");
  };

  const addEditSpecialty = () => {
    if (editSpecialtyInput.trim()) {
      setEditSpecialties([...editSpecialties, editSpecialtyInput.trim()]);
      setEditSpecialtyInput("");
    }
  };

  const removeEditSpecialty = (index: number) => {
    setEditSpecialties(editSpecialties.filter((_, i) => i !== index));
  };

  const addEditResponsibility = () => {
    if (editResponsibilityInput.trim()) {
      setEditResponsibilities([
        ...editResponsibilities,
        editResponsibilityInput.trim(),
      ]);
      setEditResponsibilityInput("");
    }
  };

  const removeEditResponsibility = (index: number) => {
    setEditResponsibilities(editResponsibilities.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      const updateData: any = {
        name: editName,
        email: editEmail,
        role: editRole,
        specialties: editSpecialties,
        responsibilities: editResponsibilities,
      };

      if (editPassword.trim()) {
        updateData.password = editPassword;
      }

      const res = await fetch(`/api/director/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const updatedUser = {
          ...editingUser,
          name: editName,
          email: editEmail,
          role: editRole,
          specialties: editSpecialties,
          responsibilities: editResponsibilities,
        };
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? updatedUser : u)),
        );
        closeEdit();
        setError("");
      } else {
        const data = await res.json();
        setError(data.error || "Ошибка при обновлении");
      }
    } catch {
      setError("Ошибка при обновлении");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Удалить пользователя?")) return;

    try {
      const res = await fetch(`/api/director/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch {
      setError("Ошибка при удалении");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "director":
        return "Директор";
      case "admin":
        return "Администратор";
      case "manager":
        return "Менеджер";
      default:
        return role;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ru-RU");
  };

  return (
    <div className="director-users">
      <div className="director-users__header">
        <h1>Управление пользователями</h1>
        <p>Добавляйте, редактируйте и удаляйте сотрудников</p>
      </div>

      <div className="director-users__action">
        <button
          className="director-users__add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "−" : "+"} Новый пользователь
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            className="director-users__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h2>Новый сотрудник</h2>

            <div className="director-users__field">
              <label>Имя *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Например: Артем"
                required
              />
            </div>

            <div className="director-users__field">
              <label>Email *</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="artem@nexsol.ru"
                required
              />
            </div>

            <div className="director-users__field">
              <label>Пароль *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
              />
            </div>

            <div className="director-users__field">
              <label>Роль *</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
              >
                <option value="manager">Менеджер</option>
                <option value="admin">Администратор</option>
                <option value="director">Директор</option>
              </select>
            </div>

            <div className="director-users__field">
              <label>Специальности</label>
              <div className="director-users__tag-input">
                <input
                  type="text"
                  value={newSpecialtyInput}
                  onChange={(e) => setNewSpecialtyInput(e.target.value)}
                  placeholder="Например: Frontend разработчик"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addSpecialty())
                  }
                />
                <button type="button" onClick={addSpecialty}>
                  +
                </button>
              </div>
              <div className="director-users__tags">
                {newSpecialties.map((spec, index) => (
                  <span key={index} className="director-users__tag">
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="director-users__field">
              <label>Обязанности</label>
              <div className="director-users__tag-input">
                <input
                  type="text"
                  value={newResponsibilityInput}
                  onChange={(e) => setNewResponsibilityInput(e.target.value)}
                  placeholder="Например: Разработка сайтов"
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addResponsibility())
                  }
                />
                <button type="button" onClick={addResponsibility}>
                  +
                </button>
              </div>
              <div className="director-users__tags">
                {newResponsibilities.map((resp, index) => (
                  <span key={index} className="director-users__tag">
                    {resp}
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" className="director-users__submit">
              Создать пользователя
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingUser && (
          <>
            <motion.div
              className="director-users__modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.form
                className="director-users__modal"
                onSubmit={handleEditSubmit}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
              >
                <div className="director-users__modal-header">
                  <h2>Редактировать пользователя</h2>
                  <button
                    type="button"
                    className="director-users__modal-close"
                    onClick={closeEdit}
                  >
                    ×
                  </button>
                </div>

                <div className="director-users__modal-content">
                  <div className="director-users__field">
                    <label>Имя *</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="director-users__field">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="director-users__field">
                    <label>
                      Новый пароль (оставьте пустым, если не меняете)
                    </label>
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Минимум 6 символов"
                    />
                  </div>

                  <div className="director-users__field">
                    <label>Роль *</label>
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as any)}
                    >
                      <option value="manager">Менеджер</option>
                      <option value="admin">Администратор</option>
                      <option value="director">Директор</option>
                    </select>
                  </div>

                  <div className="director-users__field">
                    <label>Специальности</label>
                    <div className="director-users__tag-input">
                      <input
                        type="text"
                        value={editSpecialtyInput}
                        onChange={(e) => setEditSpecialtyInput(e.target.value)}
                        placeholder="Например: Frontend разработчик"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addEditSpecialty())
                        }
                      />
                      <button type="button" onClick={addEditSpecialty}>
                        +
                      </button>
                    </div>
                    <div className="director-users__tags">
                      {editSpecialties.map((spec, index) => (
                        <span key={index} className="director-users__tag">
                          {spec}
                          <button
                            type="button"
                            onClick={() => removeEditSpecialty(index)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="director-users__field">
                    <label>Обязанности</label>
                    <div className="director-users__tag-input">
                      <input
                        type="text"
                        value={editResponsibilityInput}
                        onChange={(e) =>
                          setEditResponsibilityInput(e.target.value)
                        }
                        placeholder="Например: Разработка сайтов"
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addEditResponsibility())
                        }
                      />
                      <button type="button" onClick={addEditResponsibility}>
                        +
                      </button>
                    </div>
                    <div className="director-users__tags">
                      {editResponsibilities.map((resp, index) => (
                        <span key={index} className="director-users__tag">
                          {resp}
                          <button
                            type="button"
                            onClick={() => removeEditResponsibility(index)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="director-users__modal-footer">
                  <button
                    type="button"
                    className="director-users__modal-cancel"
                    onClick={closeEdit}
                  >
                    Отмена
                  </button>
                  <button type="submit" className="director-users__modal-save">
                    Сохранить
                  </button>
                </div>
              </motion.form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="director-users__list">
        {loading ? (
          <div className="director-users__loading">Загрузка...</div>
        ) : users.length === 0 ? (
          <div className="director-users__empty">Нет пользователей</div>
        ) : (
          users.map((user) => (
            <motion.div
              key={user._id}
              className="director-users__card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="director-users__card-header">
                <div>
                  <h3>{user.name}</h3>
                  <span className="director-users__card-role">
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <div className="director-users__card-actions">
                  <button
                    className="director-users__card-edit"
                    onClick={() => openEdit(user)}
                  >
                    ✎
                  </button>
                  <button
                    className="director-users__card-delete"
                    onClick={() => deleteUser(user._id)}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="director-users__card-email">{user.email}</div>

              {user.specialties && user.specialties.length > 0 && (
                <div className="director-users__card-section">
                  <span className="director-users__card-label">
                    Специальности:
                  </span>
                  <div className="director-users__card-tags">
                    {user.specialties.map((spec, i) => (
                      <span key={i} className="director-users__card-tag">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.responsibilities && user.responsibilities.length > 0 && (
                <div className="director-users__card-section">
                  <span className="director-users__card-label">
                    Обязанности:
                  </span>
                  <div className="director-users__card-tags">
                    {user.responsibilities.map((resp, i) => (
                      <span key={i} className="director-users__card-tag">
                        {resp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="director-users__card-footer">
                <span>Добавлен: {formatDate(user.createdAt)}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {error && <div className="director-users__error">{error}</div>}
    </div>
  );
}
