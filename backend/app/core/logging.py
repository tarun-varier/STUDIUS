# backend/app/core/logging.py
import logging

# Create a custom logger
logger = logging.getLogger("STUDIUS")
logger.setLevel(logging.DEBUG)

# Create handler (where the logs go, e.g., console)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)

logger.addHandler(handler)