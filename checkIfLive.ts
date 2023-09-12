export default async function checkIfLive(username: string) {
  try {
    const response = await fetch(`https://twitch.tv/${username}`);
    const sourceCode = await response.text();
    return sourceCode.includes("isLiveBroadcast")
  }
  catch (error) {
    console.log("Error occurred:", error);
  }

}