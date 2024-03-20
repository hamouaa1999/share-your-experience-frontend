import React from 'react';
import { render } from '@testing-library/react';
import Comment from './components/Comment';

// Mocking axios and AuthContext
jest.mock('axios');
jest.mock('./contexts/AuthContext', () => ({
  AuthContext: { state: { user: { user: { _id: 'mockUserId' } } } }
}));

describe('Comment component', () => {
  it('renders correctly', () => {
    const comment = {
      _id: 'mockCommentId',
      content: 'Test comment content',
      author: 'mockAuthorId'
    };

    const { container } = render(
      <Comment
        comment={comment}
        comments={[]}
        setComments={jest.fn()}
        post={{ comments: 0 }}
        setPost={jest.fn()}
      />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
