enum ErrorCode {
  Unknown,
  BadRequest,
  SessionNotFound,
  UserConflict,
  UserNotFound,
  UserBanned,
  UserPermissionDenied,
  UserUnauthorized,
  UserOrProjectNotFound,
  ProjectNotFound,
  ProjectConflict,
  LabelNotFound,
  LabelConlict
}

export default ErrorCode
