import { useSelector } from "react-redux";
import { selectUserRole } from "../features/auth/authSelectors";
import { USER_ROLES } from "../features/auth/authConstants";
import { getRedirectPath } from "../features/auth/authUtils";

export function useRole() {
  const role = useSelector(selectUserRole);
  const isRecruiter = role === USER_ROLES.RECRUITER;
  const isUser = role === USER_ROLES.USER;
  const redirectPath = getRedirectPath(role);
  return { role, isRecruiter, isUser, redirectPath };
}
