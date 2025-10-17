def paginate(items, page=1, per_page=20):
    """
    Paginate a list of items
    
    Args:
        items: List of items to paginate
        page: Page number (starts at 1)
        per_page: Items per page
        
    Returns:
        Dictionary with paginated data and metadata
    """
    # Ensure valid values
    page = max(1, page)
    per_page = max(1, min(per_page, 100))  # Max 100 items per page
    
    total_items = len(items)
    total_pages = (total_items + per_page - 1) // per_page  # Ceiling division
    
    # Calculate start and end indices
    start = (page - 1) * per_page
    end = start + per_page
    
    # Get items for current page
    paginated_items = items[start:end]
    
    return {
        'items': paginated_items,
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total_items': total_items,
            'total_pages': total_pages,
            'has_next': page < total_pages,
            'has_prev': page > 1
        }
    }
