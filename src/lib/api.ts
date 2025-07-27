import { API, graphqlOperation } from 'aws-amplify';
import { createContact } from '../graphql/mutations';

export interface ContactFormData {
  name: string;
  email: string;
  org?: string;
  message: string;
}

export async function submitContact(data: ContactFormData) {
  const input = {
    name: data.name,
    email: data.email,
    org: data.org,
    message: data.message,
    timestamp: new Date().toISOString(),
  };
  try {
    const result = await API.graphql(graphqlOperation(createContact, { input }));
    return { success: true, result };
  } catch (error) {
    return { success: false, error };
  }
}
