let _io = null;

export function initIO(io) {
  _io = io;
}
export function sendToUser(userId, eventName, data) {
  if (_io) {
    _io.to(userId.toString()).emit(eventName, data);
  }
}
