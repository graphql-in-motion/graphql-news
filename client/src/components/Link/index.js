import React from 'react';
import styled from 'styled-components';

const Title = styled.a`
  color: #34495e;
  text-decoration: none;
  font-size: 1.2em;
`;

const Url = styled.a`
  font-size: 0.8em;
  color: #848584;
  margin: 0 0 0 0.25em;
  text-decoration: none;
`;

const Link = ({ author, url, description, comments, score }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Score score={score} />
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <div>
        <Title href="#">{description}</Title>
        <Url href="#">({url.replace(/(^\w+:|^)\/\//, '')})</Url>
      </div>
      <Meta author={author} comments={comments} />
    </div>
  </div>
);

const ScoreContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1em 0 0;
`;

const ScoreTrigger = styled.div`
  font-size: 0.6em;
  cursor: pointer;
`;

const Arrow = styled.span`
  display: inline-block;
  color: #848584;
`;

const ScoreCount = styled.span`
  font-weight: bold;
  color: #ff6600;
  margin: 0.2em 0;
`;

const Score = ({ score }) => (
  <ScoreContainer>
    <ScoreTrigger>
      <Arrow style={{ color: '#FF6600' }}>▲</Arrow>
    </ScoreTrigger>

    <ScoreCount>{score}</ScoreCount>

    <ScoreTrigger>
      <Arrow>▼</Arrow>
    </ScoreTrigger>
  </ScoreContainer>
);

const MetaContainer = styled.div`
  display: flex;
  margin-top: 0.25em;
  color: #848584;

  a {
    &:hover {
      color: #ff6600;
    }
  }
`;

const Separator = styled.span`
  margin: 0 0.25em;
`;

const Anchor = styled.a`
  color: inherit;
`;

const Meta = ({ author, comments }) => (
  <MetaContainer>
    <span>
      by <Anchor href="#">{author}</Anchor> 3 hours ago
    </span>
    <Separator>|</Separator>
    <span>
      <Anchor href="#">hide</Anchor>
    </span>
    <Separator>|</Separator>
    <span>
      <Anchor href="#">{comments} comments</Anchor>
    </span>
  </MetaContainer>
);

export default Link;
