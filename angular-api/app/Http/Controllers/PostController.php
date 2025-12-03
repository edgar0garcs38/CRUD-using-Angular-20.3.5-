<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::select("id", "title", "body", "comment")->get();
        return response()->json($posts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $post = Post::create($request->only(["title", "body", "comment"]));
        return response()->json([
            "id" => $post->id,
            "title" => $post->title,
            "body" => $post->body,
            "comment" => $post->comment,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::find($id);
        
        return response()->json([
            "id" => $post->id,
            "title" => $post->title,
            "body" => $post->body,
            "comment" => $post->comment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        // Log request body for debugging
        Log::info("PATCH /api/posts/{$id} body:", $request->all());

        try {
            // Find post
            $post = Post::find($id);
            if (!$post) {
                return response()->json(['message' => 'Post not found'], 404);
            }

            // Validate only the fields you expect
            $validated = $request->validate([
                'comment' => 'required|string|max:10000',
                // add other fields only if you expect them in PATCH
            ]);

            // Option A: safe mass assignment (ensure $fillable contains 'comment')
            $post->fill($validated);
            $post->save();

            // Option B (explicit): $post->comment = $validated['comment']; $post->save();

            return response()->json($post, 200);

        } catch (\Illuminate\Validation\ValidationException $ve) {
            // Return 422 with validation details
            return response()->json(['message' => 'Validation failed', 'errors' => $ve->errors()], 422);

        } catch (\Exception $e) {
            // Log detailed server error and return generic message
            Log::error("Error updating post {$id}: " . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all()
            ]);

            // If local dev you can return $e->getMessage() by toggling APP_DEBUG
            return response()->json([
                'message' => 'Internal server error',
                'detail' => $e->getMessage() // remove in production
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Post::destroy($id);
        return response()->json(["message" => "Post deleted successfully"]);
    }
}
