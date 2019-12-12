const helper = {
  stopInputs() {
    document.removeEventListener('keydown', handleAttackInputKeyDown);
    inputStatusObj[17][0] = false;
    document.removeEventListener('keydown', handleMoveInputKeyDown);
    inputStatusObj[37][0] = false;
    inputStatusObj[39][0] = false;
  },
  resumeInput() {
    document.addEventListener('keydown', handleAttackInputKeyDown);
    document.addEventListener('keydown', handleMoveInputKeyDown);
  }
}