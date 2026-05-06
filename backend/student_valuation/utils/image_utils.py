import cv2
import numpy as np

class ImageProcessor:
    @staticmethod
    def preprocess_for_ocr(image_bytes):
        """
        Processes raw image bytes to make text clearer for OCR.
        """
        # 1. Convert bytes to OpenCV image
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return None

        # 2. Convert to Grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 3. Increase Contrast and Denoise
        # This helps if the student took a photo of a transcript in low light
        denoised = cv2.fastNlMeansDenoising(gray, h=10)

        # 4. Thresholding (Turns image into pure Black & White)
        # This makes the text "pop" out from the background
        _, thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        return thresh

    @staticmethod
    def auto_rotate(image):
        """
        Detects if the document is sideways and rotates it.
        (Optional: requires advanced orientation logic)
        """
        # For now, we return the processed image
        return image

def get_processed_image(file_contents):
    processor = ImageProcessor()
    processed_img = processor.preprocess_for_ocr(file_contents)
    return processed_img