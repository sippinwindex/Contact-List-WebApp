// src/services/Fetch.js
// this creates the original agenda for the API to do its shenanigans //
const AGENDA_SLUG = 'jandryf';
const API_BASE_URL = `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}`;

async function handleResponse(response, operationName = "API Call") {
    if (response.status === 204) return null; // No content for DELETE

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json().catch(() => ({ detail: "Failed to parse JSON response." }));
    } else {
        const textData = await response.text().catch(() => "Could not read response text.");
        // If it's not JSON, it might still be an error oh well 
        data = { detail: textData || `Non-JSON response from ${operationName}` };
        console.log(`Non-JSON response from ${operationName}:`, textData);
    }

    if (!response.ok) {
        const errorMessage = data?.detail || data?.message || (typeof data === 'string' ? data : `${operationName} failed with status: ${response.status}`);
        console.error(`${operationName} Error:`, errorMessage, "Status:", response.status, "Response Data:", data);
        throw new Error(errorMessage);
    }
    return data;
}

export const createAgendaIfNotExist = async () => {
    console.log(`Attempting to create or verify agenda: ${AGENDA_SLUG}`);
    try {
        // Try to POST to create the agenda.
        const createResponse = await fetch(API_BASE_URL, { method: 'POST' });

        if (createResponse.ok) {
            const responseData = await createResponse.json().catch(() => null);
            console.log(`Agenda '${AGENDA_SLUG}' created or already existed. Response:`, responseData);
            return responseData;
        } else if (createResponse.status === 400) {

            const errorData = await createResponse.json().catch(() => ({}));
            if (errorData.detail && errorData.detail.toLowerCase().includes("already exist")) {
                console.log(`Agenda '${AGENDA_SLUG}' already exists (as per 400 error).`);

                const getResponse = await fetch(API_BASE_URL);
                return handleResponse(getResponse, "GET Agenda after assumed creation");
            }
            throw new Error(errorData.detail || `Failed to create agenda, status: ${createResponse.status}`);
        } else {

            const errorData = await createResponse.json().catch(() => ({}));
            throw new Error(errorData.detail || `Error creating agenda status: ${createResponse.status}`);
        }
    } catch (error) {
        console.error("Error in createAgendaIfNotExist:", error.message);
        // If creation fails, subsequent calls will likely also fail.

        throw error;
    }
};

export const fetchAllContactsAPI = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/contacts`);
        // If 404, it often means agenda doesn't exist OR it exists but has no contacts.
        if (response.status === 404) {
            console.warn(`fetchAllContactsAPI: Got 404 for /contacts. Agenda '${AGENDA_SLUG}' might not exist or is empty.`);


            try {
                await createAgendaIfNotExist(); // Ensure agenda is there
                console.log(`fetchAllContactsAPI: Agenda '${AGENDA_SLUG}' should now exist. Returning empty array as API 404s on empty contact list.`);
                return []; // An empty agenda returns 404 for contacts, so return empty array.
            } catch (agendaError) {
                console.error("fetchAllContactsAPI: Failed to ensure agenda exists after 404 on /contacts:", agendaError.message);
                throw new Error(`Agenda "${AGENDA_SLUG}" might not exist and creation failed: ${agendaError.message}`);
            }
        }
        const data = await handleResponse(response, "Fetch All Contacts");
        return data.contacts || [];
    } catch (error) {
        console.error("fetchAllContactsAPI top-level error:", error.message);
        // If error includes "doesn't exist", try creating agenda
        if (error.message && error.message.toLowerCase().includes("doesn't exist")) {
            console.log("Attempting to create agenda due to 'doesn't exist' error during fetch.");
            try {
                await createAgendaIfNotExist();
                // After creation, the contact list is empty
                return [];
            } catch (agendaCreationError) {
                 console.error("Failed to create agenda after initial fetch error:", agendaCreationError.message)
                 throw new Error(`Failed to fetch contacts and subsequently failed to create agenda: ${agendaCreationError.message}`);
            }
        }
        throw error;
    }
};

export const addContactAPI = async (contactData) => {
    try {
        // Ensure agenda exists BEFORE trying to add a contact!
        await createAgendaIfNotExist();
    } catch (agendaError) {
        console.error("addContactAPI: Failed to ensure agenda exists before adding contact:", agendaError.message);
        throw new Error(`Cannot add contact because agenda setup failed: ${agendaError.message}`); // Propagate a clear error
    }

    const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
    });
    return handleResponse(response, "Add Contact");
};

export const updateContactAPI = async (contactId, contactData) => {
    // Agenda should exist already 
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
    });
    return handleResponse(response, "Update Contact");
};

export const deleteContactAPI = async (contactId) => {
    // Agenda should exist for deleting
    const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
        method: 'DELETE',
    });
    return handleResponse(response, "Delete Contact"); // Expects 204 No Content
};