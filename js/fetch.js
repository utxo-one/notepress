export async function fetchUserProfile(npub, ndk) {
  const user = ndk.getUser({ npub });
  await user.fetchProfile();
  console.log("User profile:", user.profile);
  return user;
}

export async function fetchNotes(ndk) {
  const kind1filter = { kinds: [1], authors: [hexkey] };
  return ndk.fetchEvents(kind1filter);
}

export async function fetchLongNotes(hexkey, ndk) {
  const kind1filter = { kinds: [30023], authors: [hexkey] };
  const events = await ndk.fetchEvents(kind1filter);
  return events;
}
