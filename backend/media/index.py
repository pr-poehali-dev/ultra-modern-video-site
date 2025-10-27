import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage media content (videos, music, blog posts) - CRUD operations
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with media data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            media_type = params.get('type', 'videos')
            
            if media_type == 'videos':
                cur.execute('SELECT * FROM videos ORDER BY created_at DESC')
            elif media_type == 'music':
                cur.execute('SELECT * FROM music ORDER BY created_at DESC')
            elif media_type == 'blog':
                cur.execute('SELECT * FROM blog_posts ORDER BY created_at DESC')
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid media type'}),
                    'isBase64Encoded': False
                }
            
            items = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'items': items}, default=str),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            media_type = body_data.get('type')
            
            if media_type == 'video':
                cur.execute(
                    'INSERT INTO videos (title, description, video_url, thumbnail_url, duration) VALUES (%s, %s, %s, %s, %s) RETURNING *',
                    (body_data.get('title'), body_data.get('description'), body_data.get('video_url'), 
                     body_data.get('thumbnail_url'), body_data.get('duration'))
                )
            elif media_type == 'music':
                cur.execute(
                    'INSERT INTO music (title, artist, album, audio_url, cover_url, duration) VALUES (%s, %s, %s, %s, %s, %s) RETURNING *',
                    (body_data.get('title'), body_data.get('artist'), body_data.get('album'),
                     body_data.get('audio_url'), body_data.get('cover_url'), body_data.get('duration'))
                )
            elif media_type == 'blog':
                cur.execute(
                    'INSERT INTO blog_posts (title, content, cover_url, author) VALUES (%s, %s, %s, %s) RETURNING *',
                    (body_data.get('title'), body_data.get('content'), body_data.get('cover_url'), body_data.get('author'))
                )
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid media type'}),
                    'isBase64Encoded': False
                }
            
            conn.commit()
            new_item = cur.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'item': new_item}, default=str),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            media_type = params.get('type')
            item_id = params.get('id')
            
            if not item_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ID required'}),
                    'isBase64Encoded': False
                }
            
            if media_type == 'video':
                cur.execute('DELETE FROM videos WHERE id = %s', (item_id,))
            elif media_type == 'music':
                cur.execute('DELETE FROM music WHERE id = %s', (item_id,))
            elif media_type == 'blog':
                cur.execute('DELETE FROM blog_posts WHERE id = %s', (item_id,))
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
