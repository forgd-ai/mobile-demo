// Description: Navigation route names and their params, shared by screens and navigators.
// Description: Keep this in sync with the navigators in App.tsx.

export type ActivitiesStackParamList = {
  ActivityList: undefined;
  ActivityDetail: { id: number };
};

export type RootTabParamList = {
  ActivitiesTab: undefined;
  SummaryTab: undefined;
};
