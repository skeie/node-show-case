const isCurrent = async (phase, _, context) => {
  const { phaseId } = await context.dataSources.tracking.getUserPhase(
    context.user.id
  );

  return phaseId === phase.id;
};

export default isCurrent;
