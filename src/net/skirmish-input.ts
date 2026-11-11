declare global {
    interface Window {
        _grimcraftSendCommand?: (command: Record<string, any>) => void;
        _networkPlayerId?: number;
        _networkSchema?: number;
    }
}
export function sendSkirmishCommand(command: Record<string, any>): boolean {
    if (typeof window === 'undefined' || !window._multiplayerMode || !window._grimcraftSendCommand)
        return false;
    window._grimcraftSendCommand(command);
    return true;
}
