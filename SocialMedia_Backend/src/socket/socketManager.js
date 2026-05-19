let _io = null;

export function initIO(io) {
  _io = io;
}

// Emit an event to all sockets belonging to a user (room = userId)
export function sendToUser(userId, eventName, data) {
  if (_io) {
    _io.to(userId.toString()).emit(eventName, data);
  }
}
