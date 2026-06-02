import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
const VideoPlayer = ({ videoId, title, isOpen, onClose, onComplete }) => {
    const [isFullscreen, setIsFullscreen] = useState(true);
    const iframeRef = useRef(null);
    useEffect(() => {
        if (!isOpen)
            return;
        const handleMessage = (event) => {
            // YouTube Origin check
            const isYouTube = event.origin.includes('youtube.com') || event.origin.includes('youtube-nocookie.com');
            // Vimeo Origin check
            const isVimeoOrigin = event.origin.includes('vimeo.com');
            if (!isYouTube && !isVimeoOrigin)
                return;
            let data;
            try {
                data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            }
            catch (e) {
                return;
            }
            if (!data)
                return;
            if (isYouTube) {
                // Handle various YouTube message formats
                const state = data.info?.playerState ?? data.info;
                const eventName = data.event;
                if ((eventName === 'onStateChange' && state === 0) || (eventName === 'infoDelivery' && state === 0)) {
                    if (onComplete)
                        onComplete();
                    // Delay closure slightly to allow UI to update
                    setTimeout(() => onClose(), 500);
                }
            }
            if (isVimeoOrigin) {
                // Vimeo sends events to the parent
                // When using api=1, we can get 'finish'
                if (data.event === 'finish' || data.event === 'ended') {
                    if (onComplete)
                        onComplete();
                    setTimeout(() => onClose(), 500);
                }
                // After receiving 'ready', subscribe to 'finish'
                if (data.event === 'ready') {
                    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ method: 'addEventListener', value: 'finish' }), '*');
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen, onComplete, onClose]);
    const handleVideoEnd = () => {
        if (onComplete) {
            onComplete();
        }
    };
    return (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'w-full max-w-[100vw] h-full sm:max-w-[95vw] sm:h-[95vh]' : 'max-w-4xl'} p-0 overflow-hidden bg-background border-border sm:rounded-2xl [&>button]:hidden`}>
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 border-b border-border bg-card flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-foreground text-lg font-semibold pr-8 truncate">
                {title}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:bg-secondary">
                <X className="w-5 h-5"/>
              </Button>
            </div>
          </DialogHeader>

          <div className="w-full flex-1 flex items-center justify-center relative group">
            {/* Protective Overlays to block sharing/YouTube links */}
            {/* Top area: Blocks Title, Watch Later, and Share */}
            <div className="absolute top-0 left-0 w-full h-24 z-20 cursor-default"/>

            {/* Bottom-right area: Adjusted to block ONLY the YouTube logo text, not the Fullscreen button */}
            <div className="absolute bottom-0 right-12 w-24 h-12 z-20 cursor-default"/>

            {(() => {
            const isVimeo = videoId.includes('vimeo') || /^\d+$/.test(videoId);
            const cleanId = videoId.replace(/https?:\/\/vimeo\.com\//, '').split('?')[0];
            if (isVimeo) {
                return (<iframe ref={iframeRef} src={`https://player.vimeo.com/video/${cleanId}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479&api=1`} title={title} className="w-full h-full relative z-10" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen/>);
            }
            return (<iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&disablekb=1&iv_load_policy=3&enablejsapi=1`} title={title} className="w-full h-full relative z-10" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>);
        })()}
          </div>
        </div>
      </DialogContent>
    </Dialog>);
};
export default VideoPlayer;
