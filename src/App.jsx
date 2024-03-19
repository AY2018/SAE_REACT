import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactForm from './ContactForm';
import ContactsList from './ContactsList';
import ContactDetail from './ContactDetail';

function App() {
  const [contacts, setContacts] = useState([]);
  const BASE_URL_API =
    'http://localhost/SAE_contactAPP/backend/public/index.php';

  // Fetch contacts from the API
  useEffect(() => {
    fetch(`${BASE_URL_API}/contacts`)
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error('Error fetching contacts:', error));
  }, []);

  // Function to add or update a contact
  const addOrUpdateContact = (contact) => {
    const method = contact.id ? 'PUT' : 'POST';
    const path = contact.id ? `/contacts/${contact.id}/edit` : '/contacts';
    fetch(`${BASE_URL_API}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
      .then(() => {
        // Re-fetch contacts to update UI
        fetch(`${BASE_URL_API}/contacts`)
          .then((response) => response.json())
          .then((data) => setContacts(data))
          .catch((error) =>
            console.error('Error re-fetching contacts:', error)
          );
      })
      .catch((error) =>
        console.error(
          `Error ${method === 'PUT' ? 'updating' : 'adding'} contact:`,
          error
        )
      );
  };

  // Function to delete a contact
  const deleteContact = (id) => {
    fetch(`${BASE_URL_API}/contacts/${id}/delete`, {
      method: 'DELETE',
    })
      .then(() => {
        // Re-fetch contacts to update UI
        fetch(`${BASE_URL_API}/contacts`)
          .then((response) => response.json())
          .then((data) => setContacts(data))
          .catch((error) =>
            console.error('Error re-fetching contacts:', error)
          );
      })
      .catch((error) => console.error('Error deleting contact:', error));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactsList contacts={contacts} />} />
        <Route
          path="/add"
          element={
            <ContactForm
              BASE_URL_API={BASE_URL_API}
              onSubmit={addOrUpdateContact}
            />
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ContactForm
              BASE_URL_API={BASE_URL_API}
              onSubmit={addOrUpdateContact}
              contacts={contacts}
            />
          }
        />
        <Route
          path="/contact/:id"
          element={
            <ContactDetail
              contacts={contacts}
              onDelete={deleteContact}
              BASE_URL_API={BASE_URL_API}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
