export function preventDialogClose(e: React.MouseEvent | React.KeyboardEvent) {
  e.preventDefault();
  e.stopPropagation();
}
