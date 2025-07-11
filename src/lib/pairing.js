import { fetchAPI } from "./api";

export async function checkPairingStatus() {
    try {
        const response = await fetchAPI('couple/pairing/status/')
        return response
    } catch (err) {
        console.error(err)
        return { is_paired: false, couple: null}
    }
}

export async function requirePairedUser() {
  const { is_paired } = await checkPairingStatus();

  if (!is_paired) {
    window.location.href = '/pairing/';
    return false;
  }
  return true;
}