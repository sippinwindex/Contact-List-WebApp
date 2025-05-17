// src/store.js
export const initialStore = () => {
  return {
    contacts: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'fetchedContacts':
      const contactsWithDefaults = (action.payload || []).map((contact, index) => ({
        ...contact,
        image_url: contact.image_url || `https://avatar.iran.liara.run/public/${contact.id || index + 10}` // Generic fallback
      }));
      console.log("Reducer: fetchedContacts", contactsWithDefaults);
      return {
        ...store,
        contacts: Array.isArray(contactsWithDefaults) ? [...contactsWithDefaults] : []
      };
    case 'ADD_CONTACT_SUCCESS':
      console.log("Reducer: ADD_CONTACT_SUCCESS", action.payload);
      // Ensure the payload has an image_url, even if it's just a default for consistency
      const newContact = {
        ...action.payload,
        image_url: action.payload.image_url || `https://avatar.iran.liara.run/public/${action.payload.id || store.contacts.length + 100}`
      };
      return {
        ...store,
        contacts: [...store.contacts, newContact]
      };
    case 'UPDATE_CONTACT_SUCCESS':
      console.log("Reducer: UPDATE_CONTACT_SUCCESS", action.payload);
      const updatedContact = {
        ...action.payload,
        image_url: action.payload.image_url || `https://avatar.iran.liara.run/public/${action.payload.id}`
      };
      return {
        ...store,
        contacts: store.contacts.map(contact =>
          contact.id === updatedContact.id ? updatedContact : contact
        )
      };
    case 'DELETE_CONTACT_SUCCESS':
      console.log("Reducer: DELETE_CONTACT_SUCCESS (id):", action.payload);
      return {
        ...store,
        contacts: store.contacts.filter(contact => contact.id !== action.payload)
      };
    default:
      console.warn(`Unknown action type: ${action.type}`);
      return store;
  }
}