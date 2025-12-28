export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const UserProfile = IDL.Record({
    'principal' : IDL.Principal,
    'publicIdeas' : IDL.Nat,
    'username' : IDL.Opt(IDL.Text),
    'createdAt' : IDL.Int,
    'reputation' : IDL.Nat,
    'email' : IDL.Opt(IDL.Text),
    'totalIdeas' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({ 'ok' : UserProfile, 'err' : IDL.Text });
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
  const Result_4 = IDL.Variant({ 'ok' : Idea, 'err' : IDL.Text });
  const ProofRecord = IDL.Record({
    'creator' : IDL.Principal,
    'proofHash' : IDL.Text,
    'network' : IDL.Text,
    'isVerified' : IDL.Bool,
    'blockHeight' : IDL.Nat,
    'timestamp' : IDL.Int,
    'ideaId' : IDL.Text,
    'canisterId' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'ok' : ProofRecord, 'err' : IDL.Text });
  const IdeaInput = IDL.Record({
    'status' : IdeaStatus,
    'title' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'description' : IDL.Text,
    'category' : IDL.Text,
    'semantic' : IDL.Opt(SemanticReport),
    'ipfsHash' : IDL.Opt(IDL.Text),
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'createCollaborativeIdea' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Principal), IDL.Nat],
        [Result],
        [],
      ),
    'createUserProfile' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result_2],
        [],
      ),
    'getIdea' : IDL.Func([IDL.Text], [Result_4], ['query']),
    'getProofRecord' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'getPublicFeed' : IDL.Func(
        [IDL.Opt(IDL.Nat), IDL.Opt(IDL.Text), IDL.Vec(IDL.Text)],
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
    'getUserProfile' : IDL.Func([], [Result_2], []),
    'revealIdea' : IDL.Func([IDL.Text], [Result], []),
    'searchIdeas' : IDL.Func(
        [IDL.Text, IDL.Opt(IDL.Nat)],
        [IDL.Vec(Idea)],
        ['query'],
      ),
    'signCollaborativeIdea' : IDL.Func([IDL.Text], [Result], []),
    'submitIdea' : IDL.Func([IdeaInput], [Result_1], []),
    'updateIdea' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [Result],
        [],
      ),
    'verifyIdea' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
