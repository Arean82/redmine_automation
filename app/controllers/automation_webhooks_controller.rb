class AutomationWebhooksController < ActionController::Base
  skip_forgery_protection

  # Receives an external webhook and triggers all enabled rules that have an
  # IncomingWebhook trigger, running them against the given issue.
  #
  #   POST /automation_webhooks  { "issue_id": 123, ... }
  #
  # NOTE: this endpoint is intentionally unauthenticated so external systems can
  # call it. Restrict access at the network layer (firewall/reverse proxy) or add
  # a shared secret once a plugin settings screen provides one.
  def receive
    issue = find_issue
    return render(json: { error: "issue_id is required" }, status: :unprocessable_entity) unless issue

    AutomationNodes::Triggers::IncomingWebhook.trigger!(issue)

    render json: { status: "ok", issue_id: issue.id }
  end

  private

  def find_issue
    id = params[:issue_id].presence || params.dig(:payload, :issue_id)
    Issue.find_by(id: id)
  end
end
