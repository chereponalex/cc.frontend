const compareAnswers = (questions: any[], clientAnswers: any) => {
  if (!questions || questions.length === 0) {
    return true;
  }
  for (const question of questions) {
    if (clientAnswers?.[question.id] !== question.reply) {
      return false;
    }
  }
  return true;
};

export default compareAnswers;
