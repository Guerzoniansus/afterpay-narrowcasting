var selectedPage = "";

/**
 * Send AJAX Post request to pagehandler.php to retrieve pages and the HTML to display them
 */
function loadPages() {
    $(".pages-containers-container").load("pagehandler.php", {action: "load"});

    // Set timeout variable
    $.post("generalsettings.php", {action: "getTimeout"}, function(data) {
        $("#timeout-input").val(data);
    });
}

function hideOverlay() {
    $(".overlay").hide();
}


function addPage() {

    if ($("#page-name-input").val() === "") {
        $("#page-name-input-error").text("Name cannot be empty");
    }

    else if (/^[A-Za-z0-9 ]+$/.test($("#page-name-input").val()) == false) {
        $("#page-name-input-error").text("Name can only contain letters and numbers, no special characters");
    }
    else {
        var pageName = $("#page-name-input").val();

        /**
         * Send AJAX Post request to pagehandler.php to add a page with pageName
         */
        $.post("../pagehandler.php", {action: "addPage", pageName: pageName}, function (data, status) {
            if (status != "success" || data == null) {
                $("#page-name-input-error").text("Something went wrong, please try again");
            }

            else {
                if (data != "success") {
                    $("#page-name-input-error").text(data);
                }

                else {
                    $("#page-name-input").val("");
                    loadPages();
                    hideOverlay();
                }
            }
        })
    }

}

$(document).ready(function() {

    hideOverlay()
    loadPages();

    $("#add-page-button").click(function() {
        $("#overlay-page-settings-name").show();
        $("#page-name-input").focus();
    });

    /**
     * Pressing enter to submit page name
     */
    $(document).on('keyup', '#page-name-input', function(event) {
        if (event.key == "Enter") {
            addPage();
        }
    });


    /**
     * Removes the add page error message when typing something else
     */
    $("#page-name-input").keyup(function() {
        $("#page-name-input-error").text("");
    });


    /**
     * When clicking on a page, redirect to edit.php with the page name in URL as GET parameter
     */
    $(document).on('click', '.page-layout-image-container', function() {
        var pageName = $(this).attr("id");
        window.location.href = "../edit.php?pageName=" + pageName;
    });

    /**
     * Change page to visible / not visible
     */
    $(document).on('click', '.visible-icon', function() {
        var pageName = $(this).attr("id");
        var src = $(this).attr("src");
        var visible = true;

        if (src == "images/eye-solid.svg") {
            src = "images/eye-slash-solid.svg";
            visible = false;
        }
        else if (src == "images/eye-slash-solid.svg") {
            src = "images/eye-solid.svg";
            visible = true;
        }

        $.post("../pagehandler.php",
            {
                action: "updatePage",
                option: "visible",
                value: visible,
                pageName: pageName
            },
            function() {
                loadPages();
            });
    });

    /**
     * Open general settings
     */
    $(document).on('click', '#general-settings-button', function() {
        selectedPage = $(this).attr("id");
        $("#overlay-page-settings").show();
    });

    /**
     * Open layout settings
     */
    $(document).on('click', '.open-settings-button', function() {
        selectedPage = $(this).attr("id");
        var pageName = selectedPage;

        // Post request to get layout data to fill the input dropdown buttons
        $.post("../pagehandler.php", {action: "getLayoutData", pageName: pageName}, function(data) {

            $(".setting-input[name='amount']").val(data.amount);
            $(".setting-input[name='twoLayout']").val(data.twoLayout);
            $(".setting-input[name='threeLayout']").val(data.threeLayout);

        }, "json");

        hideOverlay()
        $("#layout-settings-title").text("Layout Settings (" + pageName + ")");
        $("#overlay-page-settings-layout").show();
    });

    /**
     * Clicking on "delete" button
     */
    $(document).on('click', '.page-setting-button-delete', function() {

        selectedPage = $(this).attr("id");
        $("#delete-confirmation-modal").modal();

    });

    /**
     * Confirm deleting a page
     */
    $(document).on('click', '#delete-confirmation-button', function() {
        $.post("../pagehandler.php", {action: "deletePage", pageName: selectedPage}, function() {
            loadPages();
            $("#delete-confirmation-modal").modal('hide');
        });
    });


    /**
     * Hide setting overlay menus when clicking outside of it
     */
    $(document).mouseup(function(e) {
        var container = $(".settings-container");

        // if the target of the click isn't the container nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0
            && ($("#overlay-page-settings").css("display") != "none" || $("#overlay-page-settings-layout").css("display") != "none"
            || $("#overlay-page-settings-name").css("display") != "none"))
        {
            hideOverlay()
            loadPages();
        }
    });


    /**
     * Handle changing layout settings
     */
    $('.setting-input').change(function() {
        var inputName = $(this).attr("name");
        var inputValue = $(this).val();
        var pageName = selectedPage;

        $.post("../pagehandler.php",
            {
                action: "updatePage",
                option: inputName,
                value: inputValue,
                pageName: selectedPage
            },
            function() {
                loadPages();
        });

    });

    /**
     * Pressing enter to submit time to wait
     */
    $(document).on('keyup', '#timeout-input', function(event) {
        if (event.key == "Enter") {
            hideOverlay();
        }

        else {
            // This deletes non-numbers or empty inputs to make sure input is integer
            var text = $(this).val();
            text = text.replace(/[^0-9]/g,'');
            if (text == "0") text = 1;

            $(this).val(text);

            $.post("generalsettings.php", {
                action: "updateSettings",
                option: "timeout",
                newValue: text
            });
        }
    });

});