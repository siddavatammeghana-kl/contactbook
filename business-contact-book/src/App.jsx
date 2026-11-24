
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(localStorage.getItem("contacts") || "[]");
  });

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: ""
  });

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setContacts(contacts.map(c =>
        c.id === editId ? { ...form, id: editId } : c
      ));
      setEditId(null);
    } else {
      setContacts([...contacts, { ...form, id: Date.now() }]);
    }

    setForm({ name: "", address: "", phone: "", email: "" });
  };

  const editContact = (contact) => {
    setForm({
      name: contact.name,
      address: contact.address,
      phone: contact.phone,
      email: contact.email
    });
    setEditId(contact.id);
  };

  const deleteContact = (id) => {
    if (window.confirm("Delete this contact?")) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const filtered = contacts.filter(c =>
    [c.name, c.address, c.phone, c.email]
      .some(value => value.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="app">
      <header>
        <h1>📒 Business Contact Book</h1>
        <p>Manage all your important contacts in one place</p>
      </header>

      <main>
        <section className="form-section">
          <h2>{editId ? "Update Contact" : "Add New Contact"}</h2>

          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Full Name"
              value={form.name} onChange={handleChange} required />

            <input name="address" placeholder="Address"
              value={form.address} onChange={handleChange} required />

            <input name="phone" placeholder="Phone Number"
              type="tel" value={form.phone} onChange={handleChange}
              required />

            <input name="email" placeholder="Email Address"
              type="email" value={form.email} onChange={handleChange}
              required />

            <button type="submit">
              {editId ? "Update Contact" : "Save Contact"}
            </button>

            {editId && (
              <button type="button" className="cancel"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", address: "", phone: "", email: "" });
                }}>
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="contacts-section">
          <h2>My Contacts ({contacts.length})</h2>

          <input className="search"
            placeholder="🔍 Search by name, phone, email or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="contact-list">
            {filtered.length === 0 ? (
              <p className="empty">No contacts found.</p>
            ) : (
              filtered.map(contact => (
                <div className="contact-card" key={contact.id}>
                  <h3>👤 {contact.name}</h3>
                  <p>📍 {contact.address}</p>
                  <p>📞 {contact.phone}</p>
                  <p>✉️ {contact.email}</p>

                  <button onClick={() => editContact(contact)}>
                    Edit
                  </button>

                  <button className="delete"
                    onClick={() => deleteContact(contact.id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
