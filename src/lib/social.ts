export const X_HANDLE = "feralhoodnft";
export const X_PROFILE_URL = `https://x.com/${X_HANDLE}`;

// Fill this in with the exact pinned post URL (e.g. https://x.com/feralhoodnft/status/1234567890123456789)
// to get precise like/retweet/quote deep-links. Until then, tasks link to
// the profile with instructions to find the pinned post there.
export const PINNED_TWEET_URL = "";

/** Exact phrase the quote post must be published with. */
export const QUOTE_TEXT = "welcome to the wild side of the hood";

/** How many friends the tag task asks for. */
export const TAG_FRIEND_COUNT = 3;

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

/** Compose a quote of the pinned post, pre-filled with the required phrase. */
export function quoteIntentUrl(): string {
  const params = new URLSearchParams({ text: QUOTE_TEXT });
  if (PINNED_TWEET_URL) params.set("url", PINNED_TWEET_URL);
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/** Compose a post for tagging friends, leaving the handles for the user. */
export function tagIntentUrl(): string {
  const params = new URLSearchParams({
    text: `${QUOTE_TEXT} 🍄 @${X_HANDLE} — tagging ${TAG_FRIEND_COUNT} foragers: `,
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

const X_POST_URL_RE =
  /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/\d{5,}(?:[/?#].*)?$/i;

export function isValidXPostUrl(value: string): boolean {
  return X_POST_URL_RE.test(value.trim());
}

/** Author handle embedded in an X post URL, or null if it isn't one. */
export function postUrlHandle(value: string): string | null {
  const match = value.trim().match(X_POST_URL_RE);
  return match ? match[1] : null;
}
