export const idlFactory = ({ IDL }) => {
  const IdeaStatus = IDL.Variant({
    'Private' : IDL.Null,
    'Public' : IDL.Null,
    'RevealLater' : IDL.Null,
  });
  const SemanticReport = IDL.Record({ 'risk' : IDL.Text, 'score' : IDL.Nat });
  const Idea = IDL.Record({
    'id' : IDL.Text,
    'status' : IdeaStatus,
    'title' : IDL.Text,
    'creator' : IDL.Principal,
    'proofHash' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'revealTimestamp' : IDL.Opt(IDL.Int),
    'version' : IDL.Nat,
    'timestamp' : IDL.Int,
    'category' : IDL.Text,
    'semantic' : IDL.Opt(SemanticReport),
    'ipfsHash' : IDL.Opt(IDL.Text),
    'isRevealed' : IDL.Bool,
  });
  const IdeaInput = IDL.Record({
    'status' : IdeaStatus,
    'title' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'category' : IDL.Text,
    'semantic' : IDL.Opt(SemanticReport),
    'ipfsHash' : IDL.Opt(IDL.Text),
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'getPublicFeed' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Nat), IDL.Opt(IDL.Text)],
        [IDL.Vec(Idea)],
        ['query'],
      ),
    'getStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'publicIdeas' : IDL.Nat,
            'totalUsers' : IDL.Nat,
            'totalIdeas' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserIdeas' : IDL.Func([], [IDL.Vec(Idea)], []),
    'submitIdea' : IDL.Func([IdeaInput], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
