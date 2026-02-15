import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

const DOWNLOAD_DIR = './downloads';
const COOKIES_FILE = '../cookies.txt';

// Ensure download directory exists
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

/**
 * Download YouTube video/audio
 * @param {string} url - YouTube URL
 * @param {string} format - 'mp4' or 'mp3'
 * @returns {Promise<{success: boolean, file?: string, error?: string}>}
 */
export async function downloadYouTube(url, format = 'mp4') {
    try {
        // Validate format
        if (!['mp4', 'mp3'].includes(format)) {
            return { success: false, error: 'Invalid format. Use "mp4" or "mp3"' };
        }

        // Check if cookies file exists
        if (!fs.existsSync(COOKIES_FILE)) {
            return { success: false, error: 'cookies.txt not found. Please add YouTube cookies.' };
        }

        // Build yt-dlp command
        const timestamp = Date.now();
        const outputTemplate = path.join(DOWNLOAD_DIR, `%(title)s_${timestamp}.%(ext)s`);

        let command;
        if (format === 'mp3') {
            // Audio only - extract MP3
            command = [
                'yt-dlp',
                '--cookies', COOKIES_FILE,
                '--js-runtimes', 'node',
                '--remote-components', 'ejs:github',
                '-x', // Extract audio
                '--audio-format', 'mp3',
                '--audio-quality', '0', // Best quality
                '-o', `"${outputTemplate}"`,
                `"${url}"`
            ].join(' ');
        } else {
            // Video - best quality MP4
            command = [
                'yt-dlp',
                '--cookies', COOKIES_FILE,
                '--js-runtimes', 'node',
                '--remote-components', 'ejs:github',
                '-f', '"bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best"',
                '--merge-output-format', 'mp4',
                '-o', `"${outputTemplate}"`,
                `"${url}"`
            ].join(' ');
        }

        console.log(`📥 Downloading ${format.toUpperCase()}: ${url}`);

        // Execute download
        const { stdout, stderr } = await execAsync(command, {
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer
        });

        // Find downloaded file
        const files = fs.readdirSync(DOWNLOAD_DIR)
            .filter(f => f.includes(timestamp.toString()))
            .map(f => path.join(DOWNLOAD_DIR, f));

        if (files.length === 0) {
            return { success: false, error: 'Download completed but file not found' };
        }

        const downloadedFile = files[0];
        console.log(`✅ Downloaded: ${path.basename(downloadedFile)}`);

        return {
            success: true,
            file: downloadedFile,
            filename: path.basename(downloadedFile)
        };

    } catch (error) {
        console.error('❌ Download error:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Clean up old downloads (keep last N files)
 * @param {number} keepLast - Number of files to keep
 */
export function cleanupDownloads(keepLast = 10) {
    try {
        const files = fs.readdirSync(DOWNLOAD_DIR)
            .map(f => ({
                name: f,
                path: path.join(DOWNLOAD_DIR, f),
                time: fs.statSync(path.join(DOWNLOAD_DIR, f)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);

        // Delete old files
        files.slice(keepLast).forEach(file => {
            fs.unlinkSync(file.path);
            console.log(`🗑️ Deleted old file: ${file.name}`);
        });

    } catch (error) {
        console.error('❌ Cleanup error:', error.message);
    }
}

// Example usage
if (import.meta.url === `file://${process.argv[1]}`) {
    const url = process.argv[2];
    const format = process.argv[3] || 'mp4';

    if (!url) {
        console.log('Usage: node youtube-downloader.js <URL> [mp4|mp3]');
        process.exit(1);
    }

    downloadYouTube(url, format).then(result => {
        if (result.success) {
            console.log('✅ Success:', result.filename);
        } else {
            console.log('❌ Error:', result.error);
        }
    });
}