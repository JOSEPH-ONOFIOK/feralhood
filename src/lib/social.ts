export const X_HANDLE = "feralhoodnft";
export const X_PROFILE_URL = `https://x.com/${X_HANDLE}`;

// Fill this in with the exact pinned post URL (e.g. https://x.com/feralhoodnft/status/1234567890123456789)
// to get precise like/retweet/quote deep-links. Until then, tasks link to
// the profile with instructions to find the pinned post there.
export const PINNED_TWEET_URL = "";

function pinnedTweetId(): string | null {
  const match = PINNED_TWEET_URL.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

export const followIntentUrl = `https://twitter.com/intent/follow?screen_name=${X_HANDLE}`;

export function likeIntentUrl(): string {
  const id = pinnedTweetId();
  return id ? `https://twitter.com/intent/like?tweet_id=${id}` : X_PROFILE_URL;
}

export function retweetIntentUrl(): string {
  const id = pinnedTweetId();
  return id ? `https://twitter.com/intent/retweet?tweet_id=${id}` : X_PROFILE_URL;
}

export function quoteIntentUrl(): string {
  const id = pinnedTweetId();
  return id
    ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(PINNED_TWEET_URL)}&text=${encodeURIComponent("Tagging a fellow forager 👇 @")}`
    : X_PROFILE_URL;
}
