let mockEvents = [];

export async function getEvents() {
  const response = await fetch("http://localhost:3000/api/eventlisted");
  mockEvents = await response.json();
  console.log(mockEvents);
  return mockEvents;
}
