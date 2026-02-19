const WORDS = [
  "ABOUT","ABOVE","ABUSE","ACTOR","ACUTE","ADMIT","ADOPT","ADULT","AFTER","AGAIN",
  "AGENT","AGREE","AHEAD","ALARM","ALBUM","ALERT","ALIKE","ALIGN","ALIVE","ALLEY",
  "ALLOW","ALONE","ALONG","ALTER","ANGEL","ANGER","ANGLE","ANGRY","ANIME","ANKLE",
  "ANNEX","APART","APPLE","APPLY","ARENA","ARGUE","ARISE","ARMOR","ARRAY","ARROW",
  "ASIDE","ASSET","ATLAS","ATTIC","AUDIO","AUDIT","AVOID","AWAKE","AWARD","AWARE",
  "AWFUL","BASIC","BASIS","BATCH","BEACH","BEARD","BEAST","BEGIN","BEING","BELOW",
  "BENCH","BIBLE","BIRTH","BLACK","BLADE","BLAME","BLAND","BLANK","BLAST","BLAZE",
  "BLEED","BLEND","BLESS","BLIND","BLOCK","BLOOD","BLOOM","BLOWN","BOARD","BONUS",
  "BOOST","BOOTH","BOUND","BRAIN","BRAND","BRAVE","BREAD","BREAK","BREED","BRICK",
  "BRIDE","BRIEF","BRING","BROAD","BROKE","BROOK","BROWN","BRUSH","BUILD","BUILT",
  "BUNCH","BURST","BUYER","CABIN","CAMEL","CANDY","CARRY","CATCH","CAUSE","CHAIN",
];

export function getDailyWord(): string {
  const epoch = new Date("2024-01-01").getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysSinceEpoch = Math.floor((today.getTime() - epoch) / 86400000);
  return WORDS[daysSinceEpoch % WORDS.length];
}

export function getDailyNumber(): number {
  const epoch = new Date("2024-01-01").getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - epoch) / 86400000) + 1;
}
