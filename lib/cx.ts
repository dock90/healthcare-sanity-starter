/** Join class names, dropping falsy values. The only class helper in the repo. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
