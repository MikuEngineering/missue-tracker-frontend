enum ErrorCode {
  Unknown,
  BadRequest,
  SessionNotFound,
  UserConflict,
  UserNotFound,
  UserBanned,
  UserPermissionDenied,
  UserUnauthorized,
  ProjectNotFound,
  ProjectConflict,
  LabelNotFound,
  LabelConlict
}

export default ErrorCode
