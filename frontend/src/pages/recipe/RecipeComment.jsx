//src/components/Recipe/RecipeComment.jsx
import React, { useState, useContext } from 'react';
import RecipeContext from '../../pages/recipe/RecipeContext';
import { Comment, Form, Button, Icon } from 'semantic-ui-react';

function RecipeComment({ comment }) { // recipeIdx props 제거, comment props 추가
    const { createComment, deleteComment, updateComment } = useContext(RecipeContext);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const handleCommentSubmit = async () => {
        try {
            await createComment(comment.recipeIdx, newComment); // recipeIdx를 comment 객체에서 가져옴
            setNewComment('');
        } catch (error) {
            console.error('댓글 작성 실패:', error);
        }
    };

    const handleEditClick = () => {
        setEditingComment(comment.recipeCommentIdx);
        setEditedContent(comment.recipeContent);
    };

    const handleEditSubmit = async (commentIdx) => {
        try {
            await updateComment(commentIdx, editedContent);
            setEditingComment(null);
        } catch (error) {
            console.error('댓글 수정 실패:', error);
        }
    };

    const handleDeleteClick = async (commentIdx) => {
        const confirmDelete = window.confirm('정말로 댓글을 삭제하시겠습니까?');
        if (confirmDelete) {
            try {
                await deleteComment(commentIdx);
            } catch (error) {
                console.error('댓글 삭제 실패:', error);
            }
        }
    };

    return (
        <div>
            <Comment key={comment.recipeCommentIdx}> {/* comments.map 제거 */}
                <Comment.Avatar src='/images/avatar/small/matt.jpg' /> {/* 사용자 프로필 이미지 */}
                <Comment.Content>
                    <Comment.Author as='a'>{comment.nickname}</Comment.Author>
                    <Comment.Metadata>
                        <div>{comment.createdAt}</div> {/* 작성 시간 표시 */}
                    </Comment.Metadata>
                    <Comment.Text>
                        {editingComment === comment.recipeCommentIdx ? (
                            <Form.Input
                                value={editedContent}
                                onChange={e => setEditedContent(e.target.value)}
                            />
                        ) : (
                            comment.recipeContent
                        )}
                    </Comment.Text>
                    <Comment.Actions>
                        {editingComment === comment.recipeCommentIdx ? (
                            <Comment.Action onClick={() => handleEditSubmit(comment.recipeCommentIdx)}>
                                수정 완료
                            </Comment.Action>
                        ) : (
                            <Comment.Action onClick={handleEditClick}>
                                수정
                            </Comment.Action>
                        )}
                        <Comment.Action onClick={() => handleDeleteClick(comment.recipeCommentIdx)}>
                            삭제
                        </Comment.Action>
                    </Comment.Actions>
                </Comment.Content>
            </Comment>

            {/* 댓글 입력 폼 */}
            <Form reply>
                <Form.TextArea value={newComment} onChange={e => setNewComment(e.target.value)} />
                <Button content='댓글 추가' labelPosition='left' icon='edit' primary onClick={handleCommentSubmit} />
            </Form>
        </div>
    );


}
export { RecipeComment }; // named export로 변경