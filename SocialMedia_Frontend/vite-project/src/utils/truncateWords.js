const truncateWords = (text, limit) => {
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};
export {truncateWords}