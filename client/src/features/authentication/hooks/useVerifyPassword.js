export default function useVerifyPassword(password, confirmPassword) {
  return password && confirmPassword && password === confirmPassword;
}
