// Global variables
let ads = JSON.parse(localStorage.getItem('smartAds')) || [];
let currentAdId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load saved ads
    loadSavedAds();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check for hash routing
    checkHashRouting();
    
    // Initialize color picker
    initColorPicker();
    
    // Initialize size options
    initSizeOptions();
});

// Set up event listeners
function setupEventListeners() {
    // Color options
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('bg-color').value = this.dataset.color;
            updatePreview();
        });
    });
    
    // Custom color picker
    document.getElementById('custom-color').addEventListener('input', function() {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        document.getElementById('bg-color').value = this.value;
        updatePreview();
    });
    
    // Form changes that should update preview
    const previewUpdateFields = ['ad-image', 'ad-video', 'ad-text', 'ad-link', 'bg-color', 'ad-position'];
    previewUpdateFields.forEach(id => {
        document.getElementById(id).addEventListener('input', updatePreview);
        document.getElementById(id).addEventListener('change', updatePreview);
    });
}

// Initialize color picker
function initColorPicker() {
    document.getElementById('custom-color').value = '#ffffff';
}

// Initialize size options
function initSizeOptions() {
    document.querySelectorAll('.ad-size-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.ad-size-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            if (this.dataset.size === 'custom') {
                document.getElementById('custom-size-container').style.display = 'block';
                document.getElementById('ad-preview').style.width = '300px';
                document.getElementById('ad-preview').style.height = '250px';
            } else {
                document.getElementById('custom-size-container').style.display = 'none';
                const [width, height] = this.dataset.size.split('x');
                document.getElementById('ad-preview').style.width = `${width}px`;
                document.getElementById('ad-preview').style.height = `${height}px`;
                updatePreview();
            }
        });
    });
    
    // Custom size inputs
    document.getElementById('custom-width').addEventListener('input', function() {
        document.getElementById('ad-preview').style.width = `${this.value}px`;
        updatePreview();
    });
    
    document.getElementById('custom-height').addEventListener('input', function() {
        document.getElementById('ad-preview').style.height = `${this.value}px`;
        updatePreview();
    });
}

// Tab navigation
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }
    
    const tabs = document.getElementsByClassName('tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Update form fields based on ad type
function updateFormFields() {
    const adType = document.getElementById('ad-type').value;
    
    // Show/hide video URL field
    document.getElementById('video-url-container').style.display = 
        adType === 'video' ? 'block' : 'none';
    
    // Show/hide size options for certain ad types
    document.getElementById('size-container').style.display = 
        adType === 'social' || adType === 'fullscreen' ? 'none' : 'block';
    
    // Update preview
    updatePreview();
}

// Update the preview based on current form values
function updatePreview() {
    const adType = document.getElementById('ad-type').value;
    const preview = document.getElementById('ad-preview');
    const bgColor = document.getElementById('bg-color').value;
    const adText = document.getElementById('ad-text').value;
    const adLink = document.getElementById('ad-link').value;
    const adImage = document.getElementById('ad-image').value;
    const adVideo = document.getElementById('ad-video').value;
    const position = document.getElementById('ad-position').value;
    
    // Set background color
    preview.style.backgroundColor = bgColor;
    
    // Clear previous content
    preview.innerHTML = '';
    
    // Create content based on ad type
    switch(adType) {
        case 'banner':
            if (adImage) {
                const img = document.createElement('img');
                img.src = adImage;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                preview.appendChild(img);
            }
            
            if (adText) {
                const textDiv = document.createElement('div');
                textDiv.textContent = adText;
                textDiv.style.position = 'absolute';
                textDiv.style.bottom = '0';
                textDiv.style.left = '0';
                textDiv.style.right = '0';
                textDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
                textDiv.style.color = 'white';
                textDiv.style.padding = '10px';
                textDiv.style.textAlign = 'center';
                preview.appendChild(textDiv);
            }
            break;
            
        case 'video':
            if (adVideo) {
                const video = document.createElement('video');
                video.src = adVideo;
                video.style.width = '100%';
                video.style.height = '100%';
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                preview.appendChild(video);
            }
            break;
            
        case 'social':
            const socialBar = document.createElement('div');
            socialBar.style.position = 'absolute';
            socialBar.style.width = '100%';
            socialBar.style.height = '50px';
            socialBar.style.backgroundColor = bgColor;
            socialBar.style.display = 'flex';
            socialBar.style.alignItems = 'center';
            socialBar.style.justifyContent = 'center';
            
            if (position === 'top') {
                socialBar.style.top = '0';
            } else if (position === 'bottom') {
                socialBar.style.bottom = '0';
            } else if (position === 'left') {
                socialBar.style.width = '50px';
                socialBar.style.height = '100%';
                socialBar.style.left = '0';
                socialBar.style.flexDirection = 'column';
            } else if (position === 'right') {
                socialBar.style.width = '50px';
                socialBar.style.height = '100%';
                socialBar.style.right = '0';
                socialBar.style.flexDirection = 'column';
            }
            
            const ctaButton = document.createElement('button');
            ctaButton.textContent = adText || 'Click Here';
            ctaButton.style.padding = '8px 15px';
            ctaButton.style.backgroundColor = '#4361ee';
            ctaButton.style.color = 'white';
            ctaButton.style.border = 'none';
            ctaButton.style.borderRadius = '4px';
            ctaButton.style.cursor = 'pointer';
            
            socialBar.appendChild(ctaButton);
            preview.appendChild(socialBar);
            break;
            
        case 'popup':
            const popup = document.createElement('div');
            popup.style.position = 'absolute';
            popup.style.width = '80%';
            popup.style.height = '80%';
            popup.style.backgroundColor = bgColor;
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.padding = '20px';
            popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
            
            if (adImage) {
                const img = document.createElement('img');
                img.src = adImage;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '70%';
                img.style.display = 'block';
                img.style.margin = '0 auto';
                popup.appendChild(img);
            }
            
            if (adText) {
                const textDiv = document.createElement('div');
                textDiv.textContent = adText;
                textDiv.style.marginTop = '15px';
                textDiv.style.textAlign = 'center';
                popup.appendChild(textDiv);
            }
            
            const closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.style.position = 'absolute';
            closeButton.style.top = '5px';
            closeButton.style.right = '5px';
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.border = 'none';
            closeButton.style.fontSize = '16px';
            closeButton.style.cursor = 'pointer';
            popup.appendChild(closeButton);
            
            preview.appendChild(popup);
            break;
            
        case 'fullscreen':
            preview.style.width = '100%';
            preview.style.height = '100vh';
            
            const fullscreenContent = document.createElement('div');
            fullscreenContent.style.position = 'relative';
            fullscreenContent.style.width = '100%';
            fullscreenContent.style.height = '100%';
            
            if (adImage) {
                const img = document.createElement('img');
                img.src = adImage;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                fullscreenContent.appendChild(img);
            }
            
            if (adText) {
                const textDiv = document.createElement('div');
                textDiv.textContent = adText;
                textDiv.style.position = 'absolute';
                textDiv.style.bottom = '20%';
                textDiv.style.left = '0';
                textDiv.style.right = '0';
                textDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
                textDiv.style.color = 'white';
                textDiv.style.padding = '20px';
                textDiv.style.textAlign = 'center';
                fullscreenContent.appendChild(textDiv);
            }
            
            const skipButton = document.createElement('button');
            skipButton.textContent = 'Skip Ad';
            skipButton.style.position = 'absolute';
            skipButton.style.bottom = '20px';
            skipButton.style.right = '20px';
            skipButton.style.padding = '8px 15px';
            skipButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
            skipButton.style.color = 'white';
            skipButton.style.border = 'none';
            skipButton.style.borderRadius = '4px';
            skipButton.style.cursor = 'pointer';
            fullscreenContent.appendChild(skipButton);
            
            preview.appendChild(fullscreenContent);
            break;
    }
    
    // Make the preview clickable (for demo purposes)
    preview.style.cursor = 'pointer';
    preview.onclick = function() {
        if (adLink) {
            window.open(adLink, '_blank');
        }
    };
}

// Generate the ad and save it
function generateAd() {
    const adName = document.getElementById('ad-name').value;
    const adType = document.getElementById('ad-type').value;
    const adImage = document.getElementById('ad-image').value;
    const adVideo = document.getElementById('ad-video').value;
    const adLink = document.getElementById('ad-link').value;
    const adText = document.getElementById('ad-text').value;
    const bgColor = document.getElementById('bg-color').value;
    const duration = document.getElementById('ad-duration').value;
    const position = document.getElementById('ad-position').value;
    
    // Validate required fields
    if (!adName || !adLink) {
        alert('Please fill in all required fields (Ad Name and Destination URL)');
        return;
    }
    
    // Get selected size
    let width, height;
    const selectedSize = document.querySelector('.ad-size-option.selected').dataset.size;
    
    if (selectedSize === 'custom') {
        width = document.getElementById('custom-width').value;
        height = document.getElementById('custom-height').value;
        
        if (!width || !height) {
            alert('Please enter custom width and height');
            return;
        }
    } else {
        [width, height] = selectedSize.split('x');
    }
    
    // For fullscreen and social ads, adjust size
    if (adType === 'fullscreen') {
        width = '100%';
        height = '100vh';
    } else if (adType === 'social') {
        if (position === 'left' || position === 'right') {
            width = '50px';
            height = '100%';
        } else {
            width = '100%';
            height = '50px';
        }
    }
    
    // Create ad object
    const ad = {
        id: currentAdId || Date.now().toString(),
        name: adName,
        type: adType,
        width: width,
        height: height,
        image: adImage,
        video: adVideo,
        link: adLink,
        text: adText,
        bgColor: bgColor,
        duration: duration,
        position: position,
        createdAt: new Date().toISOString()
    };
    
    // Save or update the ad
    if (currentAdId) {
        // Update existing ad
        const index = ads.findIndex(a => a.id === currentAdId);
        if (index !== -1) {
            ads[index] = ad;
        }
    } else {
        // Add new ad
        ads.push(ad);
    }
    
    // Save to localStorage
    localStorage.setItem('smartAds', JSON.stringify(ads));
    
    // Generate embed code and short link
    generateEmbedCode(ad);
    generateShortLink(ad);
    
    // Reload saved ads list
    loadSavedAds();
    
    // Reset currentAdId
    currentAdId = null;
    
    // Show success message
    alert(`Ad "${adName}" saved successfully!`);
}

// Generate embed code for the ad
function generateEmbedCode(ad) {
    let embedCode = '';
    
    switch(ad.type) {
        case 'banner':
            embedCode = `
<div style="width: ${ad.width}px; height: ${ad.height}px; background-color: ${ad.bgColor}; position: relative; overflow: hidden; cursor: pointer;" onclick="window.open('${ad.link}', '_blank')">
    ${ad.image ? `<img src="${ad.image}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
    ${ad.text ? `<div style="position: absolute; bottom: 0; left: 0; right: 0; background-color: rgba(0,0,0,0.7); color: white; padding: 10px; text-align: center;">${ad.text}</div>` : ''}
</div>`;
            break;
            
        case 'video':
            embedCode = `
<video width="${ad.width}" height="${ad.height}" autoplay muted loop playsinline style="cursor: pointer;" onclick="window.open('${ad.link}', '_blank')">
    <source src="${ad.video}" type="video/mp4">
    Your browser does not support the video tag.
</video>`;
            break;
            
        case 'social':
            const isVertical = ad.position === 'left' || ad.position === 'right';
            
            embedCode = `
<div style="position: fixed; ${ad.position}: 0; ${isVertical ? 'width: 50px; height: 100%;' : 'width: 100%; height: 50px;'} background-color: ${ad.bgColor}; display: flex; ${isVertical ? 'flex-direction: column;' : ''} align-items: center; justify-content: center; z-index: 1000;">
    <button style="padding: 8px 15px; background-color: #4361ee; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="window.open('${ad.link}', '_blank')">
        ${ad.text || 'Click Here'}
    </button>
</div>`;
            break;
            
        case 'popup':
            embedCode = `
<script>
    function showPopupAd() {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.height = '100%';
        popup.style.backgroundColor = 'rgba(0,0,0,0.7)';
        popup.style.zIndex = '1000';
        popup.style.display = 'flex';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        
        const popupContent = document.createElement('div');
        popupContent.style.width = '80%';
        popupContent.style.height = '80%';
        popupContent.style.backgroundColor = '${ad.bgColor}';
        popupContent.style.padding = '20px';
        popupContent.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        popupContent.style.position = 'relative';
        
        ${ad.image ? `const img = document.createElement('img');
        img.src = '${ad.image}';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '70%';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        popupContent.appendChild(img);` : ''}
        
        ${ad.text ? `const textDiv = document.createElement('div');
        textDiv.textContent = '${ad.text}';
        textDiv.style.marginTop = '15px';
        textDiv.style.textAlign = 'center';
        popupContent.appendChild(textDiv);` : ''}
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            document.body.removeChild(popup);
        };
        popupContent.appendChild(closeButton);
        
        popupContent.style.cursor = 'pointer';
        popupContent.onclick = function() {
            window.open('${ad.link}', '_blank');
        };
        
        popup.appendChild(popupContent);
        document.body.appendChild(popup);
        
        setTimeout(function() {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, ${ad.duration * 1000});
    }
    
    // Show popup after 3 seconds
    setTimeout(showPopupAd, 3000);
</script>`;
            break;
            
        case 'fullscreen':
            embedCode = `
<script>
    function showFullscreenAd() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = '${ad.bgColor}';
        overlay.style.zIndex = '10000';
        
        ${ad.image ? `const img = document.createElement('img');
        img.src = '${ad.image}';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        overlay.appendChild(img);` : ''}
        
        ${ad.text ? `const textDiv = document.createElement('div');
        textDiv.textContent = '${ad.text}';
        textDiv.style.position = 'absolute';
        textDiv.style.bottom = '20%';
        textDiv.style.left = '0';
        textDiv.style.right = '0';
        textDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
        textDiv.style.color = 'white';
        textDiv.style.padding = '20px';
        textDiv.style.textAlign = 'center';
        overlay.appendChild(textDiv);` : ''}
        
        const skipButton = document.createElement('button');
        skipButton.textContent = 'Skip Ad';
        skipButton.style.position = 'absolute';
        skipButton.style.bottom = '20px';
        skipButton.style.right = '20px';
        skipButton.style.padding = '8px 15px';
        skipButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
        skipButton.style.color = 'white';
        skipButton.style.border = 'none';
        skipButton.style.borderRadius = '4px';
        skipButton.style.cursor = 'pointer';
        skipButton.onclick = function() {
            document.body.removeChild(overlay);
        };
        overlay.appendChild(skipButton);
        
        overlay.style.cursor = 'pointer';
        overlay.onclick = function() {
            window.open('${ad.link}', '_blank');
        };
        
        document.body.appendChild(overlay);
        
        setTimeout(function() {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, ${ad.duration * 1000});
    }
    
    // Show fullscreen ad immediately
    showFullscreenAd();
</script>`;
            break;
    }
    
    document.getElementById('embed-code').textContent = embedCode.trim();
}

// Generate short link for the ad
function generateShortLink(ad) {
    const shortLink = `${window.location.origin}${window.location.pathname}#/ad${ad.id}`;
    document.getElementById('short-link').textContent = shortLink;
}

// Load saved ads
function loadSavedAds() {
    const adsList = document.getElementById('ads-list');
    adsList.innerHTML = '';
    
    if (ads.length === 0) {
        adsList.innerHTML = '<p>No ads saved yet. Create your first ad!</p>';
        return;
    }
    
    ads.forEach(ad => {
        const adItem = document.createElement('div');
        adItem.className = 'ad-item';
        
        adItem.innerHTML = `
            <div class="ad-item-info">
                <h3>${ad.name}</h3>
                <p>Type: ${ad.type} | Size: ${ad.width}x${ad.height} | Created: ${new Date(ad.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="ad-item-actions">
                <button onclick="editAd('${ad.id}')">Edit</button>
                <button onclick="viewAd('${ad.id}')">View</button>
                <button class="delete-btn" onclick="deleteAd('${ad.id}')">Delete</button>
            </div>
        `;
        
        adsList.appendChild(adItem);
    });
}

// Edit an existing ad
function editAd(adId) {
    const ad = ads.find(a => a.id === adId);
    if (!ad) return;
    
    currentAdId = adId;
    
    // Fill the form with ad data
    document.getElementById('ad-name').value = ad.name;
    document.getElementById('ad-type').value = ad.type;
    document.getElementById('ad-image').value = ad.image || '';
    document.getElementById('ad-video').value = ad.video || '';
    document.getElementById('ad-link').value = ad.link;
    document.getElementById('ad-text').value = ad.text || '';
    document.getElementById('bg-color').value = ad.bgColor;
    document.getElementById('ad-duration').value = ad.duration || 5;
    document.getElementById('ad-position').value = ad.position || 'center';
    
    // Update form fields
    updateFormFields();
    
    // Set color picker
    document.querySelectorAll('.color-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.dataset.color === ad.bgColor) {
            opt.classList.add('selected');
        }
    });
    
    // Set size options
    const sizeStr = `${ad.width}x${ad.height}`;
    const standardSizes = ['300x250', '728x90', '160x600', '320x50'];
    
    if (standardSizes.includes(sizeStr)) {
        document.querySelectorAll('.ad-size-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.size === sizeStr) {
                opt.classList.add('selected');
            }
        });
        document.getElementById('custom-size-container').style.display = 'none';
    } else {
        document.querySelector('.ad-size-option[data-size="custom"]').classList.add('selected');
        document.getElementById('custom-size-container').style.display = 'block';
        document.getElementById('custom-width').value = ad.width;
        document.getElementById('custom-height').value = ad.height;
    }
    
    // Update preview
    updatePreview();
    
    // Generate embed code and short link
    generateEmbedCode(ad);
    generateShortLink(ad);
    
    // Switch to create tab
    document.querySelector('.tab').click();
}

// View an ad (render it in preview)
function viewAd(adId) {
    const ad = ads.find(a => a.id === adId);
    if (!ad) return;
    
    // Create a temporary preview container
    const preview = document.createElement('div');
    preview.style.position = 'fixed';
    preview.style.top = '0';
    preview.style.left = '0';
    preview.style.width = '100%';
    preview.style.height = '100%';
    preview.style.backgroundColor = 'rgba(0,0,0,0.8)';
    preview.style.zIndex = '1000';
    preview.style.display = 'flex';
    preview.style.justifyContent = 'center';
    preview.style.alignItems = 'center';
    
    // Create close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.backgroundColor = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '40px';
    closeButton.style.height = '40px';
    closeButton.style.fontSize = '20px';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
        document.body.removeChild(preview);
    };
    preview.appendChild(closeButton);
    
    // Create ad container
    const adContainer = document.createElement('div');
    adContainer.style.width = ad.type === 'fullscreen' ? '100%' : `${ad.width}${typeof ad.width === 'string' ? '' : 'px'}`;
    adContainer.style.height = ad.type === 'fullscreen' ? '100vh' : `${ad.height}${typeof ad.height === 'string' ? '' : 'px'}`;
    adContainer.style.backgroundColor = ad.bgColor;
    adContainer.style.position = 'relative';
    adContainer.style.overflow = 'hidden';
    adContainer.style.cursor = 'pointer';
    adContainer.onclick = function() {
        window.open(ad.link, '_blank');
    };
    
    // Render ad based on type
    switch(ad.type) {
        case 'banner':
            if (ad.image) {
                const img = document.createElement('img');
                img.src = ad.image;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                adContainer.appendChild(img);
            }
            
            if (ad.text) {
                const textDiv = document.createElement('div');
                textDiv.textContent = ad.text;
                textDiv.style.position = 'absolute';
                textDiv.style.bottom = '0';
                textDiv.style.left = '0';
                textDiv.style.right = '0';
                textDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
                textDiv.style.color = 'white';
                textDiv.style.padding = '10px';
                textDiv.style.textAlign = 'center';
                adContainer.appendChild(textDiv);
            }
            break;
            
        case 'video':
            if (ad.video) {
                const video = document.createElement('video');
                video.src = ad.video;
                video.style.width = '100%';
                video.style.height = '100%';
                video.autoplay = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                adContainer.appendChild(video);
            }
            break;
            
        case 'social':
            const isVertical = ad.position === 'left' || ad.position === 'right';
            
            const socialBar = document.createElement('div');
            socialBar.style.position = 'absolute';
            socialBar.style.width = isVertical ? '50px' : '100%';
            socialBar.style.height = isVertical ? '100%' : '50px';
            socialBar.style.backgroundColor = ad.bgColor;
            socialBar.style.display = 'flex';
            socialBar.style.flexDirection = isVertical ? 'column' : 'row';
            socialBar.style.alignItems = 'center';
            socialBar.style.justifyContent = 'center';
            
            const ctaButton = document.createElement('button');
            ctaButton.textContent = ad.text || 'Click Here';
            ctaButton.style.padding = '8px 15px';
            ctaButton.style.backgroundColor = '#4361ee';
            ctaButton.style.color = 'white';
            ctaButton.style.border = 'none';
            ctaButton.style.borderRadius = '4px';
            ctaButton.style.cursor = 'pointer';
            
            socialBar.appendChild(ctaButton);
            adContainer.appendChild(socialBar);
            break;
            
        case 'popup':
            const popupContent = document.createElement('div');
            popupContent.style.width = '80%';
            popupContent.style.height = '80%';
            popupContent.style.backgroundColor = ad.bgColor;
            popupContent.style.padding = '20px';
            popupContent.style.position = 'relative';
            
            if (ad.image) {
                const img = document.createElement('img');
                img.src = ad.image;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '70%';
                img.style.display = 'block';
                img.style.margin = '0 auto';
                popupContent.appendChild(img);
            }
            
            if (ad.text) {
                const textDiv = document.createElement('div');
                textDiv.textContent = ad.text;
                textDiv.style.marginTop = '15px';
                textDiv.style.textAlign = 'center';
                popupContent.appendChild(textDiv);
            }
            
            adContainer.style.width = '100%';
            adContainer.style.height = '100%';
            adContainer.style.display = 'flex';
            adContainer.style.justifyContent = 'center';
            adContainer.style.alignItems = 'center';
            adContainer.appendChild(popupContent);
            break;
            
        case 'fullscreen':
            if (ad.image) {
                const img = document.createElement('img');
                img.src = ad.image;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                adContainer.appendChild(img);
            }
            
            if (ad.text) {
                const textDiv = document.createElement('div');
                textDiv.textContent = ad.text;
                textDiv.style.position = 'absolute';
                textDiv.style.bottom = '20%';
                textDiv.style.left = '0';
                textDiv.style.right = '0';
                textDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
                textDiv.style.color = 'white';
                textDiv.style.padding = '20px';
                textDiv.style.textAlign = 'center';
                adContainer.appendChild(textDiv);
            }
            
            const skipButton = document.createElement('button');
            skipButton.textContent = 'Skip Ad';
            skipButton.style.position = 'absolute';
            skipButton.style.bottom = '20px';
            skipButton.style.right = '20px';
            skipButton.style.padding = '8px 15px';
            skipButton.style.backgroundColor = 'rgba(0,0,0,0.5)';
            skipButton.style.color = 'white';
            skipButton.style.border = 'none';
            skipButton.style.borderRadius = '4px';
            skipButton.style.cursor = 'pointer';
            skipButton.onclick = function(e) {
                e.stopPropagation();
                document.body.removeChild(preview);
            };
            adContainer.appendChild(skipButton);
            break;
    }
    
    preview.appendChild(adContainer);
    document.body.appendChild(preview);
}

// Delete an ad
function deleteAd(adId) {
    if (confirm('Are you sure you want to delete this ad?')) {
        ads = ads.filter(a => a.id !== adId);
        localStorage.setItem('smartAds', JSON.stringify(ads));
        
        if (currentAdId === adId) {
            currentAdId = null;
            document.getElementById('ad-form').reset();
            document.getElementById('embed-code').textContent = '';
            document.getElementById('short-link').textContent = '';
        }
        
        loadSavedAds();
    }
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const range = document.createRange();
    range.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    
    // Show feedback
    const originalText = elementId === 'embed-code' ? 'Copy Code' : 'Copy Link';
    const button = elementId === 'embed-code' 
        ? document.querySelector('.copy-btn') 
        : document.querySelectorAll('.copy-btn')[1];
    
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

// Check for hash routing
function checkHashRouting() {
    const hash = window.location.hash;
    if (hash.startsWith('#/ad')) {
        const adId = hash.replace('#/ad', '');
        const ad = ads.find(a => a.id === adId);
        
        if (ad) {
            // Show the ad
            viewAd(adId);
        } else {
            // Redirect to home if ad not found
            window.location.hash = '';
        }
    }
}
