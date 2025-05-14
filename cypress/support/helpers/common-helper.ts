class CommonHelper {

  static generate_random_string(
    length: number = 7,
    prefix: string = "",
    suffix: string = ""
  ): string {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `${prefix} ${text} ${suffix}`
  }
}
export default CommonHelper;