
export function useConvertTime(milliseconds: number) {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const correctedValue = hours === 0 ? `${minutes} min` : `${hours}:${minutes}`;
    return correctedValue;
}

export function useDateFormat(dateString: string) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-GB'); 
    return formattedDate;
}