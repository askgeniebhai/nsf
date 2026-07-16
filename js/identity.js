"use strict";

const IdentityModule = (() => {

    let currentEmployeeId = null;

    const initAdmin = () => {
        renderGrid();

        // Search & Filter Listeners
        document.getElementById('search-emp')?.addEventListener('input', renderGrid);
        document.getElementById('filter-designation')?.addEventListener('change', renderGrid);
        document.getElementById('filter-status')?.addEventListener('change', renderGrid);
    };

    const initGuard = (guardId) => {
        const employees = JSON.parse(localStorage.getItem('nsf_employees') || '[]');
        const emp = employees.find(e => e.id === guardId);

        if(!emp) return;

        const container = document.getElementById('guard-profile-container');
        if(!container) return;

        container.innerHTML = `
            <div class="profile-card">
                <div class="profile-header">
                    <img src="${emp.photo || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23e2e8f0\'><path d=\'M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z\'/></svg>'}" class="profile-photo" alt="Photo">
                    <h2>${emp.name}</h2>
                    <p>${emp.id} • ${emp.designation}</p>
                    <div style="margin-top:15px; position:relative; display:inline-block;">
                        <button class="btn-update" style="color:white; border-color:rgba(255,255,255,0.3);">Update Photo</button>
                        <input type="file" accept="image/jpeg, image/png, image/webp" capture="environment" onchange="IdentityModule.handleUpload(event, 'photo', '${emp.id}')" style="position:absolute; left:0; top:0; opacity:0; width:100%; height:100%; cursor:pointer;">
                    </div>
                </div>
                <div class="profile-details">
                    <div class="detail-item"><label>Mobile</label><p>${emp.mobile}</p></div>
                    <div class="detail-item"><label>Date of Birth</label><p>${emp.dob || 'Not Provided'}</p></div>
                    <div class="detail-item"><label>Blood Group</label><p>${emp.bloodGroup || 'Not Provided'}</p></div>
                    <div class="detail-item"><label>Emergency Contact</label><p>${emp.emergencyContact || 'Not Provided'}</p></div>
                    <div class="detail-item" style="grid-column: 1 / -1;"><label>Address</label><p>${emp.address || 'Not Provided'}</p></div>
                </div>
                <div class="docs-section">
                    <h3>My Identity Documents</h3>
                    <div class="doc-list">
                        ${renderGuardDocRow('Aadhaar Card', emp.documents?.aadhaar, 'aadhaar', emp.id)}
                        ${renderGuardDocRow('PAN Card', emp.documents?.pan, 'pan', emp.id)}
                        ${renderGuardDocRow('Driving Licence', emp.documents?.dl, 'dl', emp.id)}
                        ${renderGuardDocRow('Voter ID', emp.documents?.voterId, 'voterId', emp.id)}
                    </div>
                </div>
            </div>
        `;
        if (window.lucide) window.lucide.createIcons();
    };

    const renderGuardDocRow = (label, docData, docType, empId) => {
        const isUploaded = !!docData;
        return `
            <div class="doc-item">
                <div class="doc-info">
                    <i data-lucide="file-text"></i>
                    <div>
                        <div style="font-size: 13px; font-weight: 600; color: #0B1F3A;">${label}</div>
                        <div class="doc-status ${isUploaded ? 'uploaded' : 'missing'}">${isUploaded ? 'Verified' : 'Required'}</div>
                    </div>
                </div>
                <div class="upload-wrapper">
                    <button class="btn-update">${isUploaded ? 'Replace' : 'Upload'}</button>
                    <input type="file" accept="image/jpeg, image/png, image/webp" capture="environment" onchange="IdentityModule.handleUpload(event, '${docType}', '${empId}')" />
                </div>
            </div>
        `;
    };

    const renderGrid = () => {
        const grid = document.getElementById('emp-grid');
        if (!grid) return;

        let employees = JSON.parse(localStorage.getItem('nsf_employees') || '[]');

        // Filters
        const search = document.getElementById('search-emp')?.value.toLowerCase() || '';
        const desig = document.getElementById('filter-designation')?.value || '';
        const status = document.getElementById('filter-status')?.value || '';

        employees = employees.filter(e => {
            const matchSearch = e.name.toLowerCase().includes(search) || e.id.toLowerCase().includes(search) || e.mobile.includes(search);
            const matchDesig = desig === '' || e.designation === desig;
            const matchStatus = status === '' || e.status === status;
            return matchSearch && matchDesig && matchStatus;
        });

        grid.innerHTML = employees.map(emp => {
            const hasPhoto = !!emp.photo;
            const docsCount = emp.documents ? Object.values(emp.documents).filter(d => d !== null).length : 0;
            const photoSrc = hasPhoto ? emp.photo : 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23e2e8f0\'><path d=\'M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z\'/></svg>';

            return `
                <div class="id-card">
                    <div class="id-card-header">
                        <img src="${photoSrc}" class="id-photo" alt="Photo">
                        <div>
                            <h3 style="margin:0; font-size:15px; color:#0B1F3A;">${emp.name}</h3>
                            <p style="margin:2px 0 0; font-size:11px; color:#64748b; font-weight:600; text-transform:uppercase;">${emp.id} • ${emp.designation}</p>
                        </div>
                    </div>
                    <div class="id-card-body">
                        <p>Mobile: <span>${emp.mobile}</span></p>
                        <p>Blood Group: <span style="color:#ef4444">${emp.bloodGroup || 'N/A'}</span></p>
                        <p>Docs Uploaded: <span>${docsCount}/5</span></p>
                    </div>
                    <div class="id-card-footer">
                        <button class="btn-action btn-view" onclick="window.open('idcard.html?id=${emp.id}', '_blank')">ID Card</button>
                        <button class="btn-action btn-docs" onclick="IdentityModule.openDocsModal('${emp.id}')">Manage Docs</button>
                    </div>
                </div>
            `;
        }).join('');
    };

    const openDocsModal = (empId) => {
        currentEmployeeId = empId;
        const employees = JSON.parse(localStorage.getItem('nsf_employees') || '[]');
        const emp = employees.find(e => e.id === empId);

        if (!emp) return;

        document.getElementById('modal-emp-name').textContent = `Documents: ${emp.name}`;

        // Render Previews
        const setPreview = (id, dataUrl) => {
            const el = document.getElementById(id);
            if(el) {
                if(dataUrl) {
                    el.innerHTML = `<img src="${dataUrl}" alt="Document">`;
                } else {
                    el.innerHTML = `<i data-lucide="image" style="color:#cbd5e1; width:32px; height:32px;"></i>`;
                }
            }
        };

        setPreview('preview-photo', emp.photo);
        setPreview('preview-aadhaar', emp.documents?.aadhaar);
        setPreview('preview-pan', emp.documents?.pan);
        setPreview('preview-dl', emp.documents?.dl);

        document.getElementById('docs-modal').classList.add('active');
        if (window.lucide) window.lucide.createIcons();
    };

    const handleUpload = (event, docType, overrideEmpId = null) => {
        const file = event.target.files[0];
        if (!file) return;

        const targetEmpId = overrideEmpId || currentEmployeeId;
        if (!targetEmpId) return;

        // Ensure it's an image
        if (!file.type.match('image.*')) {
            alert("Please upload an image file (JPG, PNG, WEBP).");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target.result;

            // Save to LocalStorage Mock Data
            const employees = JSON.parse(localStorage.getItem('nsf_employees') || '[]');
            const index = employees.findIndex(emp => emp.id === targetEmpId);

            if (index !== -1) {
                if(docType === 'photo') {
                    employees[index].photo = base64Data;
                } else {
                    if(!employees[index].documents) employees[index].documents = {};
                    employees[index].documents[docType] = base64Data;
                }

                localStorage.setItem('nsf_employees', JSON.stringify(employees));

                // Update UI based on where we are
                if (overrideEmpId) {
                    // We are in Guard view
                    initGuard(overrideEmpId);
                } else {
                    // We are in Admin view
                    openDocsModal(currentEmployeeId);
                    renderGrid();
                }
            }
        };

        // Read as data URL (Base64) - acts as our mock "upload"
        reader.readAsDataURL(file);
    };

    window.closeDocsModal = () => {
        document.getElementById('docs-modal').classList.remove('active');
        currentEmployeeId = null;
    };

    return { initAdmin, initGuard, openDocsModal, handleUpload };
})();

window.IdentityModule = IdentityModule;
