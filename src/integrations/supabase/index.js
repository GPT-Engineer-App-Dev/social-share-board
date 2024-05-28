import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const queryClient = new QueryClient();
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

Post // table: posts
    id: number
    title: string
    body: string
    created_at: string
    author_id: string
    reactions?: Reaction[] // available if .select('*,reactions(*)') was done

Reaction // table: reactions
    id: number
    post_id: number // foreign key to Post
    user_id: string
    emoji: string

*/

// hooks

export const usePosts = () => useQuery({
    queryKey: ['posts'],
    queryFn: () => fromSupabase(supabase.from('posts').select('*,reactions(*)')),
});

export const useAddPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newPost) => fromSupabase(supabase.from('posts').insert([newPost])),
        onSuccess: () => {
            queryClient.invalidateQueries('posts');
        },
    });
};

export const useReactions = (postId) => useQuery({
    queryKey: ['reactions', postId],
    queryFn: () => fromSupabase(supabase.from('reactions').select('*').eq('post_id', postId)),
});

export const useAddReaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newReaction) => fromSupabase(supabase.from('reactions').insert([newReaction])),
        onSuccess: () => {
            queryClient.invalidateQueries('reactions');
        },
    });
};

// UI components

export function Posts() {
    const { data: posts, error, isLoading } = usePosts();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <p>{post.body}</p>
                    <Reactions postId={post.id} />
                </div>
            ))}
        </div>
    );
}

export function Reactions({ postId }) {
    const { data: reactions, error, isLoading } = useReactions(postId);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {reactions.map(reaction => (
                <span key={reaction.id}>{reaction.emoji}</span>
            ))}
        </div>
    );
}

export function AddPost() {
    const addPost = useAddPost();

    const handleSubmit = (event) => {
        event.preventDefault();
        const title = event.target.elements.title.value;
        const body = event.target.elements.body.value;
        const author_id = '1'; // Example author_id
        addPost.mutate({ title, body, author_id });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="title" placeholder="Post title" />
            <input name="body" placeholder="Post body" />
            <button type="submit">Add Post</button>
        </form>
    );
}

export function AddReaction({ postId }) {
    const addReaction = useAddReaction();

    const handleReaction = (emoji) => {
        const user_id = '1'; // Example user_id
        addReaction.mutate({ post_id: postId, emoji, user_id });
    };

    return (
        <div>
            <button onClick={() => handleReaction('👍')}>Like</button>
            <button onClick={() => handleReaction('👎')}>Dislike</button>
        </div>
    );
}